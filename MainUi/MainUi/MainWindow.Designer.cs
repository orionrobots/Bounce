namespace MainUi
{
    partial class MainWindow
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainWindow));
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.fileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.saveToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.loadToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.recentFilesToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.communicateToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.runToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.alwaysRunToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.debugToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.showWebConsoleToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.serialPort1 = new System.IO.Ports.SerialPort(this.components);
            this.openFileDialog1 = new System.Windows.Forms.OpenFileDialog();
            this.saveFileDialog1 = new System.Windows.Forms.SaveFileDialog();
            this.splitContainer1 = new System.Windows.Forms.SplitContainer();
            this.splitContainer2 = new System.Windows.Forms.SplitContainer();
            this.toolStrip1 = new System.Windows.Forms.ToolStrip();
            this.connectButton = new System.Windows.Forms.ToolStripButton();
            this.runButton = new System.Windows.Forms.ToolStripSplitButton();
            this.makeStartupToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripNodes = new System.Windows.Forms.ToolStripComboBox();
            this.findNodesButton = new System.Windows.Forms.ToolStripButton();
            this.outputBrowser = new System.Windows.Forms.WebBrowser();
            this.noRecentFilesToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuStrip1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).BeginInit();
            this.splitContainer1.Panel2.SuspendLayout();
            this.splitContainer1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer2)).BeginInit();
            this.splitContainer2.Panel1.SuspendLayout();
            this.splitContainer2.Panel2.SuspendLayout();
            this.splitContainer2.SuspendLayout();
            this.toolStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // menuStrip1
            // 
            this.menuStrip1.ImageScalingSize = new System.Drawing.Size(24, 24);
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileToolStripMenuItem,
            this.communicateToolStripMenuItem,
            this.debugToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(1453, 33);
            this.menuStrip1.TabIndex = 0;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // fileToolStripMenuItem
            // 
            this.fileToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.saveToolStripMenuItem,
            this.loadToolStripMenuItem,
            this.recentFilesToolStripMenuItem});
            this.fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            this.fileToolStripMenuItem.Size = new System.Drawing.Size(50, 29);
            this.fileToolStripMenuItem.Text = "File";
            // 
            // saveToolStripMenuItem
            // 
            this.saveToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("saveToolStripMenuItem.Image")));
            this.saveToolStripMenuItem.Name = "saveToolStripMenuItem";
            this.saveToolStripMenuItem.Size = new System.Drawing.Size(211, 30);
            this.saveToolStripMenuItem.Text = "Save";
            this.saveToolStripMenuItem.Click += new System.EventHandler(this.saveToolStripMenuItem_Click);
            // 
            // loadToolStripMenuItem
            // 
            this.loadToolStripMenuItem.Image = ((System.Drawing.Image)(resources.GetObject("loadToolStripMenuItem.Image")));
            this.loadToolStripMenuItem.Name = "loadToolStripMenuItem";
            this.loadToolStripMenuItem.Size = new System.Drawing.Size(189, 30);
            this.loadToolStripMenuItem.Text = "Load";
            this.loadToolStripMenuItem.Click += new System.EventHandler(this.loadToolStripMenuItem_Click);
            // 
            // recentFilesToolStripMenuItem
            // 
            this.recentFilesToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.noRecentFilesToolStripMenuItem});
            this.recentFilesToolStripMenuItem.Name = "recentFilesToolStripMenuItem";
            this.recentFilesToolStripMenuItem.Size = new System.Drawing.Size(211, 30);
            this.recentFilesToolStripMenuItem.Text = "Recent Files";
            // 
            // communicateToolStripMenuItem
            // 
            this.communicateToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.runToolStripMenuItem,
            this.alwaysRunToolStripMenuItem});
            this.communicateToolStripMenuItem.Name = "communicateToolStripMenuItem";
            this.communicateToolStripMenuItem.Size = new System.Drawing.Size(134, 29);
            this.communicateToolStripMenuItem.Text = "Communicate";
            // 
            // runToolStripMenuItem
            // 
            this.runToolStripMenuItem.Name = "runToolStripMenuItem";
            this.runToolStripMenuItem.Size = new System.Drawing.Size(188, 30);
            this.runToolStripMenuItem.Text = "Run";
            // 
            // alwaysRunToolStripMenuItem
            // 
            this.alwaysRunToolStripMenuItem.Name = "alwaysRunToolStripMenuItem";
            this.alwaysRunToolStripMenuItem.Size = new System.Drawing.Size(188, 30);
            this.alwaysRunToolStripMenuItem.Text = "Always Run";
            // 
            // debugToolStripMenuItem
            // 
            this.debugToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.showWebConsoleToolStripMenuItem});
            this.debugToolStripMenuItem.Name = "debugToolStripMenuItem";
            this.debugToolStripMenuItem.Size = new System.Drawing.Size(78, 29);
            this.debugToolStripMenuItem.Text = "Debug";
            // 
            // showWebConsoleToolStripMenuItem
            // 
            this.showWebConsoleToolStripMenuItem.Name = "showWebConsoleToolStripMenuItem";
            this.showWebConsoleToolStripMenuItem.Size = new System.Drawing.Size(249, 30);
            this.showWebConsoleToolStripMenuItem.Text = "Show Web console";
            this.showWebConsoleToolStripMenuItem.Click += new System.EventHandler(this.showWebConsoleToolStripMenuItem_Click);
            // 
            // openFileDialog1
            // 
            this.openFileDialog1.FileName = "openFileDialog1";
            // 
            // saveFileDialog1
            // 
            this.saveFileDialog1.Filter = "Blockly Node MCU|*.node";
            // 
            // splitContainer1
            // 
            this.splitContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.splitContainer1.Location = new System.Drawing.Point(0, 33);
            this.splitContainer1.Name = "splitContainer1";
            // 
            // splitContainer1.Panel2
            // 
            this.splitContainer1.Panel2.Controls.Add(this.splitContainer2);
            this.splitContainer1.Size = new System.Drawing.Size(1453, 708);
            this.splitContainer1.SplitterDistance = 759;
            this.splitContainer1.TabIndex = 2;
            // 
            // splitContainer2
            // 
            this.splitContainer2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.splitContainer2.Location = new System.Drawing.Point(0, 0);
            this.splitContainer2.Name = "splitContainer2";
            this.splitContainer2.Orientation = System.Windows.Forms.Orientation.Horizontal;
            // 
            // splitContainer2.Panel1
            // 
            this.splitContainer2.Panel1.Controls.Add(this.toolStrip1);
            this.splitContainer2.Panel1.RightToLeft = System.Windows.Forms.RightToLeft.No;
            // 
            // splitContainer2.Panel2
            // 
            this.splitContainer2.Panel2.Controls.Add(this.outputBrowser);
            this.splitContainer2.Panel2.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.splitContainer2.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.splitContainer2.Size = new System.Drawing.Size(690, 708);
            this.splitContainer2.SplitterDistance = 133;
            this.splitContainer2.TabIndex = 2;
            // 
            // toolStrip1
            // 
            this.toolStrip1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.toolStrip1.GripStyle = System.Windows.Forms.ToolStripGripStyle.Hidden;
            this.toolStrip1.ImageScalingSize = new System.Drawing.Size(24, 24);
            this.toolStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.connectButton,
            this.runButton,
            this.toolStripNodes,
            this.findNodesButton});
            this.toolStrip1.Location = new System.Drawing.Point(0, 0);
            this.toolStrip1.Name = "toolStrip1";
            this.toolStrip1.Size = new System.Drawing.Size(690, 133);
            this.toolStrip1.TabIndex = 0;
            this.toolStrip1.Text = "toolStrip1";
            // 
            // connectButton
            // 
            this.connectButton.Enabled = false;
            this.connectButton.Image = ((System.Drawing.Image)(resources.GetObject("connectButton.Image")));
            this.connectButton.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.connectButton.Name = "connectButton";
            this.connectButton.Size = new System.Drawing.Size(105, 130);
            this.connectButton.Text = "Connect";
            this.connectButton.ToolTipText = "Find and Connect To The NodeMCU board";
            this.connectButton.Click += new System.EventHandler(this.connectButton_Click);
            // 
            // runButton
            // 
            this.runButton.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.makeStartupToolStripMenuItem});
            this.runButton.Image = ((System.Drawing.Image)(resources.GetObject("runButton.Image")));
            this.runButton.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.runButton.Name = "runButton";
            this.runButton.Size = new System.Drawing.Size(93, 130);
            this.runButton.Text = "Run!";
            this.runButton.ToolTipText = "Upload and run this code";
            this.runButton.ButtonClick += new System.EventHandler(this.runButton_ButtonClick);
            // 
            // makeStartupToolStripMenuItem
            // 
            this.makeStartupToolStripMenuItem.Name = "makeStartupToolStripMenuItem";
            this.makeStartupToolStripMenuItem.Size = new System.Drawing.Size(203, 30);
            this.makeStartupToolStripMenuItem.Text = "Make Startup";
            // 
            // toolStripNodes
            // 
            this.toolStripNodes.Name = "toolStripNodes";
            this.toolStripNodes.Size = new System.Drawing.Size(121, 133);
            this.toolStripNodes.Click += new System.EventHandler(this.toolStripNodes_Click);
            this.toolStripNodes.OwnerChanged += new System.EventHandler(this.toolStripNodes_OwnerChanged);
            // 
            // findNodesButton
            // 
            this.findNodesButton.Image = ((System.Drawing.Image)(resources.GetObject("findNodesButton.Image")));
            this.findNodesButton.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.findNodesButton.Name = "findNodesButton";
            this.findNodesButton.Size = new System.Drawing.Size(131, 130);
            this.findNodesButton.Text = "Find Nodes";
            this.findNodesButton.Click += new System.EventHandler(this.findNodesButton_Click);
            // 
            // outputBrowser
            // 
            this.outputBrowser.AllowWebBrowserDrop = false;
            this.outputBrowser.Dock = System.Windows.Forms.DockStyle.Fill;
            this.outputBrowser.IsWebBrowserContextMenuEnabled = false;
            this.outputBrowser.Location = new System.Drawing.Point(0, 0);
            this.outputBrowser.MinimumSize = new System.Drawing.Size(20, 20);
            this.outputBrowser.Name = "outputBrowser";
            this.outputBrowser.Size = new System.Drawing.Size(690, 571);
            this.outputBrowser.TabIndex = 0;
            this.outputBrowser.Url = new System.Uri("", System.UriKind.Relative);
            this.outputBrowser.WebBrowserShortcutsEnabled = false;
            this.outputBrowser.DocumentCompleted += new System.Windows.Forms.WebBrowserDocumentCompletedEventHandler(this.outputBrowser_DocumentCompleted);
            // 
            // noRecentFilesToolStripMenuItem
            // 
            this.noRecentFilesToolStripMenuItem.Enabled = false;
            this.noRecentFilesToolStripMenuItem.Name = "noRecentFilesToolStripMenuItem";
            this.noRecentFilesToolStripMenuItem.Size = new System.Drawing.Size(211, 30);
            this.noRecentFilesToolStripMenuItem.Text = "No recent files";
            // 
            // MainWindow
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 20F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1453, 741);
            this.Controls.Add(this.splitContainer1);
            this.Controls.Add(this.menuStrip1);
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "MainWindow";
            this.Text = "Bounce";
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.splitContainer1.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).EndInit();
            this.splitContainer1.ResumeLayout(false);
            this.splitContainer2.Panel1.ResumeLayout(false);
            this.splitContainer2.Panel1.PerformLayout();
            this.splitContainer2.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer2)).EndInit();
            this.splitContainer2.ResumeLayout(false);
            this.toolStrip1.ResumeLayout(false);
            this.toolStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem saveToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem loadToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem communicateToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem runToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem alwaysRunToolStripMenuItem;
        private System.IO.Ports.SerialPort serialPort1;
        private System.Windows.Forms.OpenFileDialog openFileDialog1;
        private System.Windows.Forms.SaveFileDialog saveFileDialog1;
        private System.Windows.Forms.SplitContainer splitContainer1;
        private System.Windows.Forms.WebBrowser outputBrowser;
        private System.Windows.Forms.SplitContainer splitContainer2;
        private System.Windows.Forms.ToolStrip toolStrip1;
        private System.Windows.Forms.ToolStripButton connectButton;
        private System.Windows.Forms.ToolStripSplitButton runButton;
        private System.Windows.Forms.ToolStripMenuItem makeStartupToolStripMenuItem;
        private System.Windows.Forms.ToolStripComboBox toolStripNodes;
        private System.Windows.Forms.ToolStripMenuItem debugToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem showWebConsoleToolStripMenuItem;
        private System.Windows.Forms.ToolStripButton findNodesButton;
        private System.Windows.Forms.ToolStripMenuItem recentFilesToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem noRecentFilesToolStripMenuItem;
    }
}

