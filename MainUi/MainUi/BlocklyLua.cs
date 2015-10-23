using CefSharp;
using CefSharp.WinForms;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
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
    class BlocklyLua
    {
        private IBrowser _br;
        public BlocklyLua(ChromiumWebBrowser br)
        {
            _br = br.GetBrowser();   
        }

        public static Uri GetAddress()
        {
            string appDir = Path.GetDirectoryName(Application.ExecutablePath);
            return new Uri(Path.Combine(appDir, "BlocklyMcu", "blocklyLua.html"));
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
    }
}
