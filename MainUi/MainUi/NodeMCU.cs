using System;
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace MainUi
{
    interface OutputConsole // Output - made to feel like console output
    {
        void Write(string data);
        void Write(int data);
        void WriteLine(string data);
        void WriteLine(int data);
    }

    class NodeMCU
    {
        public static List<SerialPort> find_node(OutputConsole output)
        {
            // Search the serial ports - find a node MCU.
            // Enumerate serial ports
            string[] names = SerialPort.GetPortNames();
            output.WriteLine("Found the following ports:");
            if (names.Length == 0)
            {
                output.WriteLine("No Serial ports found...");
                return new List<SerialPort>();
            }
            else
            {
                return foundPorts(output, names);
            }
        }

        private static List<SerialPort> foundPorts(OutputConsole output, string[] names)
        {
            // Ports are found...
            foreach (string name in names)
            {
                output.WriteLine(name);
            }
            var valid_list = new List<SerialPort>();
            foreach (var name in names)
            {
                // Try finding NodeMCU at 9600 Baud.
                int baud = 9600;
                string test_cmd = "print(node.heap())\n";
                SerialPort _port = new SerialPort(names[0], 9600);
                output.WriteLine(_port.BaudRate);
                _port.Open();
                _port.WriteLine(test_cmd);
                Thread.Sleep(300); // chance to respond.
                output.WriteLine("Response was:");
                string response = _port.ReadExisting();
                output.WriteLine(response);
                if (response.Contains(">"))
                {
                    output.WriteLine("NodeMCU identified");
                    valid_list.Add(_port);
                }
                else
                {
                    output.WriteLine("Not sure what that is...");
                }
                _port.Close();
            }
            return valid_list;
        }
    }

}
