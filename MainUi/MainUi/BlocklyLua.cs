using CefSharp;
using CefSharp.WinForms;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MainUi
{
    // Render the blockly lua web component.
    // Handle getting:
    // Saving
    // Loading
    // Get Lua Code
    // Printing?
    public class BlocklyLua
    {
        public String LoadedData { get; set; }
        public delegate void DocumentChangedHandler(object sender, EventArgs e);
        public event DocumentChangedHandler DocumentChanged;

        private IBrowser _br;
        public BlocklyLua(ChromiumWebBrowser br)
        {
            br.RegisterJsObject("blocklyLua", this);
            br.IsBrowserInitializedChanged += Br_IsBrowserInitializedChanged;
        }

        // This is for the browser to notify that a change was made
        public void NotifyDocumentChanged()
        {
            if (DocumentChanged == null) return;
            EventArgs args = new EventArgs();
            DocumentChanged.Invoke(this, args);
        }

        private void Br_IsBrowserInitializedChanged(object sender, IsBrowserInitializedChangedEventArgs e)
        {
            _br = ((ChromiumWebBrowser)sender).GetBrowser();
        }

        public static Uri GetAddress()
        {
            string appDir = Path.GetDirectoryName(Application.ExecutablePath);
            return new Uri(Path.Combine(appDir, "Bounce", "blocklyLua.html"));
        }
        
        public async Task<string> GetCode()
        {
            // This will get the lua code to send to our device.   
            JavascriptResponse r = await _br.MainFrame.EvaluateScriptAsync("Blockly.Lua.workspaceToCode(workspace);");
            if(! r.Success )
            {
                throw new OperationCanceledException(r.Message);
            }
            return r.Result.ToString();
        }

        public async Task SaveDocument(Stream output)
        {
            JavascriptResponse r = await _br.FocusedFrame.EvaluateScriptAsync("export_document();");
            var sw = new StreamWriter(output);
            sw.Write(r.Result.ToString());
            sw.Flush();
        }

        public void LoadDocument(string text)
        {
            LoadedData = text;
            _br.FocusedFrame.EvaluateScriptAsync("new_document(); load_document(blocklyLua.loadedData)");            
        }

        internal void NewDocument()
        {
            _br.FocusedFrame.EvaluateScriptAsync("new_document();");
        }
    }
}
