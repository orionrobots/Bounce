using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO.Ports;
using System.Threading;

namespace TestSerialDotNet
{
    class Program
    {
        static void Main(string[] args)
        {
            // Enumerate serial ports
            string[] names = SerialPort.GetPortNames();
            Console.WriteLine("Found the following ports:");
            if (names.Length == 0)
            {
                Console.WriteLine("No Serial ports found...");
            }
            else
            {
                foundPorts(names);
            }

            Console.ReadLine();
        }

        private static void foundPorts(string[] names)
        {
            // Ports are found...
            foreach (string name in names)
            {
                Console.WriteLine(name);
            }
            // Try finding NodeMCU at 9600 Baud.
            int baud = 9600;
            string test_cmd = "print(node.heap())\n";
            SerialPort _port = new SerialPort(names[0], 9600);
            Console.WriteLine(_port.BaudRate);
            _port.Open();
            _port.WriteLine(test_cmd);
            Thread.Sleep(300); // chance to respond.
            Console.WriteLine("Response was:");
            string response = _port.ReadExisting();
            Console.WriteLine(response);
            if(response.Contains(">"))
            {
                Console.WriteLine("NodeMCU identified");
            } else
            {
                Console.WriteLine("Not sure what that is...");
            }
            _port.Close();
        }
    }
}
