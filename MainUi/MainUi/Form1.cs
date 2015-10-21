using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MainUi
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            string appDir = Path.GetDirectoryName(Application.ExecutablePath);
            outputBrowser.Navigate(Path.Combine(appDir, "emptyOutput.html"));
        }

        private void connectButton_Click(object sender, EventArgs e)
        {
            HtmlDocument _doc = outputBrowser.Document;
            HtmlElement _line = _doc.CreateElement("div");
            _line.InnerText = "Hello World!";
            _doc.GetElementById("output_panel").AppendChild(_line);
        }
    }
}
