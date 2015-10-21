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

        public class HtmlOutputWrapper : OutputConsole
        {
            private HtmlElement output_div;

            public HtmlOutputWrapper(HtmlDocument _doc)
            {
                output_div = _doc.GetElementById("output_panel");
            }

            public void Write(string data)
            {
                data = data.Replace("\n", "<br>\n");
                output_div.InnerHtml = String.Concat(output_div.InnerHtml, data);
            }

            public void Write<T>(T data)
            {
                Write(data.ToString());
            }

            public void WriteLine(string data)
            {
                Write(String.Concat(data, "<br>\n"));
            }

            public void WriteLine<T>(T data)
            {
                WriteLine(data.ToString());
            }
        } 

        private void connectButton_Click(object sender, EventArgs e)
        {
            OutputConsole con = new HtmlOutputWrapper(outputBrowser.Document);
            var nodes = NodeMCU.find_node(con);
            foreach (var node in nodes)
            {
                toolStripNodes.Items.Add(node.ToString());
            }
        }
    }
}
