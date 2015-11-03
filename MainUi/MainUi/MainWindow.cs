using System;
using System.Drawing;
using System.IO;
using System.Windows.Forms;
using CefSharp;
using CefSharp.WinForms;
using System.Diagnostics;

namespace MainUi
{
    public partial class MainWindow : Form
    {
        private BlocklyLua lua_control;
        private ChromiumWebBrowser codeBrowser;
        private OutputConsole con;
        private NodeMCU connection;
        private string current_document;
        private bool changed;
        
        public MainWindow()
        {
            InitializeComponent();
            Cef.Initialize();

            InitialiseCodeBrowser();
            RestoreSettings();
            string appDir = Path.GetDirectoryName(Application.ExecutablePath);
            outputBrowser.Navigate(Path.Combine(appDir, "emptyOutput.html"));
            changed = false;
        }


        private void InitialiseCodeBrowser()
        {
            codeBrowser = new ChromiumWebBrowser(BlocklyLua.GetAddress().ToString());
            lua_control = new BlocklyLua(codeBrowser);
            Debug.WriteLine(BlocklyLua.GetAddress());
            codeBrowser.Dock = DockStyle.Fill;
            this.splitContainer1.Panel1.Controls.Add(codeBrowser);
            codeBrowser.Location = new Point(0, 0);
            codeBrowser.MinimumSize = new Size(20, 20);
            codeBrowser.Size = new Size(690, 571);

            lua_control.DocumentChanged += Lua_control_DocumentChanged;
        }

        private void Lua_control_DocumentChanged(object sender, EventArgs e)
        {
            Invoke(new MethodInvoker(delegate
            {
                changed = true;
                setTitle();
            }));
        }

        private void connectButton_Click(object sender, EventArgs e)
        {
            if (connection == null)
            {
                string node_port = (string)toolStripNodes.SelectedItem;
                connection = new NodeMCU(node_port, con);
                connectButton.Text = "--Connected--";
                connectButton.ToolTipText = "Click to disconnect";
                toolStripNodes.Enabled = false;
            } else
            {
                connection.Close();
                connection = null;
                connectButton.Text = "Connect";
                connectButton.ToolTipText = "Click to connect";
                toolStripNodes.Enabled = true;
            }
        }

        private async void runButton_ButtonClick(object sender, EventArgs e)
        {
            string code;
            runButton.Enabled = false;
            try
            {
                code = await lua_control.GetCode();
            } catch(System.OperationCanceledException err)
            {
                Console.WriteLine("An error has occured reading the code");
                return;
            }
            con.WriteLine(code);
            if (connection != null)
            {
                connection.run_code(code);
            }
            runButton.Enabled = true;
        }

        private void outputBrowser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            if(outputBrowser.Url.ToString().Contains("emptyOutput.html")) { 
                con = new HtmlOutputWrapper(outputBrowser.Document);
            }
        }


        private void showWebConsoleToolStripMenuItem_Click(object sender, EventArgs e)
        {
            codeBrowser.ShowDevTools();
        }


        private void findNodesButton_Click(object sender, EventArgs e)
        {
            var nodes = NodeMCU.find_node(con);
            foreach (var node in nodes)
            {
                toolStripNodes.Items.Add(node.ToString());
            }
        }

        private void toolStripNodes_Click(object sender, EventArgs e)
        {
            connectButton.Enabled = toolStripNodes.SelectedItem != null;
        }

        private void toolStripNodes_OwnerChanged(object sender, EventArgs e)
        {
            connectButton.Enabled = toolStripNodes.SelectedItem != null;
        }

        private void setTitle()
        {
            Text = "Bounce";
            if (current_document != "")
            {
                Text += " - " + current_document;
                if (changed)
                {
                    saveToolStripMenuItem.Enabled = true;
                }
            }
            else
            {
                saveToolStripMenuItem.Enabled = false;
            }
            if(changed)
            {
                Text += " *";
            }
        }


        private void RestoreSettings()
        {
            var recentFiles = Properties.Settings.Default.RecentFiles;
            if (recentFiles != null && recentFiles.Count > 0)
            {
                recentFilesToolStripMenuItem.DropDownItems.Remove(noRecentFilesToolStripMenuItem);
                // Read the recent file list
                foreach (string fileName in Properties.Settings.Default.RecentFiles)
                {
                    AddRecentFile(fileName, true);
                }
            }
            else
            {
                Properties.Settings.Default.RecentFiles = new System.Collections.Specialized.StringCollection();
            }

        }

        private void AddRecentFile(string fileName, bool from_settings = false)
        {

            if (recentFilesToolStripMenuItem.DropDownItems.Count > 0 &&
                recentFilesToolStripMenuItem.DropDownItems[0] == noRecentFilesToolStripMenuItem)
            {
                recentFilesToolStripMenuItem.DropDownItems.Remove(noRecentFilesToolStripMenuItem);
            }

            // Make a new menu item - added to the recentFilesToolStripMenuItem
            ToolStripMenuItem t = new ToolStripMenuItem(fileName);
            recentFilesToolStripMenuItem.DropDownItems.Insert(0, t);
            t.Click += T_Click;

            if (!from_settings)
            {
                Properties.Settings.Default.RecentFiles.Insert(0, fileName);
            }
            if (Properties.Settings.Default.RecentFiles.Count > 10)
            {
                Properties.Settings.Default.RecentFiles.RemoveAt(10);
            }
            Properties.Settings.Default.Save();
        }

        private void T_Click(object sender, EventArgs e)
        {
            ToolStripMenuItem t = (ToolStripMenuItem)sender;

            using (StreamReader reader = new StreamReader(t.Text))
            {
                lua_control.LoadDocument(reader.ReadToEnd());
            }
            changed = false;
            current_document = t.Text;
            setTitle();
        }

        private void newToolStripMenuItem_Click(object sender, EventArgs e)
        {
            lua_control.NewDocument();
            current_document = "";
            changed = false;
            setTitle();
        }

        private async void saveToolStripMenuItem_Click(object sender, EventArgs e)
        {
            // Save using current name
            using (Stream myStream = new FileStream(current_document, FileMode.Create))
            {
                await lua_control.SaveDocument(myStream);
            }
            changed = false;
        }

        private void loadToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (openFileDialog1.ShowDialog() == DialogResult.OK)
            {
                using (StreamReader reader = new StreamReader(openFileDialog1.OpenFile()))
                {
                    lua_control.LoadDocument(reader.ReadToEnd());
                }
                AddRecentFile(openFileDialog1.FileName);
                current_document = openFileDialog1.FileName;
                setTitle();
            }
            changed = false;
        }

        private async void saveAsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            // Show the save dialog
            if (saveFileDialog1.ShowDialog() == DialogResult.OK)
            {
                using (Stream myStream = saveFileDialog1.OpenFile())
                {
                    await lua_control.SaveDocument(myStream);
                }
                AddRecentFile(saveFileDialog1.FileName);
                current_document = saveFileDialog1.FileName;
                setTitle();
            }
            changed = false;
        }
    }

}
