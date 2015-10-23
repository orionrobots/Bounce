using System;
using System.Drawing;
using System.IO;
using System.Windows.Forms;
using CefSharp;
using CefSharp.WinForms;
using System.Diagnostics;

namespace MainUi
{
    public partial class Form1 : Form
    {
        private BlocklyLua lua_control;
        private ChromiumWebBrowser codeBrowser;
        private OutputConsole con;
        
        public Form1()
        {
            InitializeComponent();
            Cef.Initialize();

            codeBrowser = new ChromiumWebBrowser(BlocklyLua.GetAddress().ToString());
            Debug.WriteLine(BlocklyLua.GetAddress());
            codeBrowser.Dock = DockStyle.Fill;
            this.splitContainer1.Panel1.Controls.Add(codeBrowser);
            codeBrowser.Location = new Point(0, 0);
            codeBrowser.MinimumSize = new Size(20, 20);
            codeBrowser.Size = new Size(690, 571);
            codeBrowser.IsBrowserInitializedChanged += CodeBrowser_IsBrowserInitializedChanged;

            string appDir = Path.GetDirectoryName(Application.ExecutablePath);
            outputBrowser.Navigate(Path.Combine(appDir, "emptyOutput.html"));
        }

        private void CodeBrowser_IsBrowserInitializedChanged(object sender, IsBrowserInitializedChangedEventArgs e)
        {
            lua_control = new BlocklyLua(codeBrowser);
        }

        private void connectButton_Click(object sender, EventArgs e)
        {
            var nodes = NodeMCU.find_node(con);
            foreach (var node in nodes)
            {
                toolStripNodes.Items.Add(node.ToString());
            }
        }

        private async void runButton_ButtonClick(object sender, EventArgs e)
        {
            var code = await lua_control.GetCode();
            con.WriteLine(code);
        }

        private void outputBrowser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            if(outputBrowser.Url.ToString().Contains("emptyOutput.html")) { 
                con = new HtmlOutputWrapper(outputBrowser.Document);
            }
        }

        private async void saveToolStripMenuItem_Click(object sender, EventArgs e)
        {
            // Show the save dialog
            if (saveFileDialog1.ShowDialog() == DialogResult.OK)
            {
                using (Stream myStream = saveFileDialog1.OpenFile())
                {
                    await lua_control.SaveDocument(myStream);
                }
            }
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            Cef.Shutdown();
        }

        private void showWebConsoleToolStripMenuItem_Click(object sender, EventArgs e)
        {
            codeBrowser.ShowDevTools();
        }
    }
}
