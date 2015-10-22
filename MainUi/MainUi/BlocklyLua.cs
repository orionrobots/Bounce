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
        private WebBrowser _br;
        public BlocklyLua(WebBrowser br)
        {
            _br = br;   
            loadPage();
        }

        private void loadPage()
        {
            string appDir = Path.GetDirectoryName(Application.ExecutablePath);
            _br.Navigate(Path.Combine(appDir, "BlocklyMcu", "blocklyLua.html"));
        }

        public string GetCode()
        {
            // This will get the lua code to send to our device.
            var code = _br.Document.InvokeScript("get_code");
            var warnings = _br.Document.InvokeScript("get_warnings");
            
            return code.ToString();
        }
    }
}
