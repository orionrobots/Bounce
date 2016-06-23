describe("BounceUi", function() {
    var ui;

    beforeEach(function() {
        ui = new BounceUI();
    });

    it("Should allow a GeneratedCode window to be connected");
    it("Should set up a menu");
    it("Should setup the config");
    it("Should trigger scan with settings");
    it("Should trigger a connect");
    
});

describe("BounceApp", function() {
    var app; /* App class - created in before */
    var oc_spy; /* Spy for output console class */
    var blockly_spy; /* Spy for blockly manager */
    beforeEach(function() {
        oc_spy = jasmine.createSpyObj("OutputConsole", ['setup','write', 'writeLine']);
        spyOn(window, "OutputConsole").and.returnValue(oc_spy);
        
        app = new BounceApp();
    });

    it("Should construct an output console", function() {
        app.setup();
        expect(window.OutputConsole).toHaveBeenCalled();
        expect(app.output_console).toEqual(oc_spy);
    });

    it("Should setup the output console", function() {
        /* The output console should be setup with the required elements */
        app.setup();
        expect(oc_spy.setup).toHaveBeenCalled();
    });
    
    it("Should construct a blockly manager");
    it("Should setup the blockly manager");
    it("Should construct a config");
    it("Should setup the config");
    it("Should construct a code generator");
    it("Should setup the code generator connecting it to blockly manager");
    it("Should construct a Bounce ui");
    it("Should setup the UI");
});

describe("BlocklyManager", function() {
    var manager;
    beforeEach(function() {
        setFixtures('<div id="blocklyArea"><div id="blocklyDiv"></div></div>');
        spyOn(Blockly, "svgResize").and.stub();
        spyOn(Blockly, "inject").and.returnValue("workspace_sentinel");
        manager = new BlocklyManager();
        Blockly.mainWorkspace = jasmine.createSpyObj("mainWorkspace", ['clear']);
    });
    
    it("Should setup a resize listener", function() {
        spyOn(manager, "resizeHandler").and.callThrough();
        manager.setup();
        expect(manager.resizeHandler).toHaveBeenCalled();
        expect(Blockly.svgResize).toHaveBeenCalled();
    });

    it("Should inject the blockly workspace", function() {
        manager.setup();
        expect(Blockly.inject).toHaveBeenCalled();
    });

    it("Should allow me to get the code", function() {
        manager.setup();
        spyOn(Blockly.Lua, "workspaceToCode").and.returnValue("print('hello world!')\n");
        expect(manager.getCode()).toEqual("print('hello world!')\n");
        expect(Blockly.Lua.workspaceToCode).toHaveBeenCalledWith("workspace_sentinel");
    });

    it("Should allow me to get XML text for it", function() {
        manager.setup();
        spyOn(Blockly.Xml, "workspaceToDom").and.returnValue("sentinel");
        spyOn(Blockly.Xml, "domToPrettyText").and.returnValue("<blah>some xml</blah>");
        expect(manager.getDocument()).toEqual("<blah>some xml</blah>");
        expect(Blockly.Xml.workspaceToDom).toHaveBeenCalledWith("workspace_sentinel");
        expect(Blockly.Xml.domToPrettyText).toHaveBeenCalledWith("sentinel");
    });
    
    it("Should load a document", function() {
        manager.setup();
        spyOn(Blockly.Xml, "textToDom");

        spyOn(Blockly.Xml, "domToWorkspace");
        var document = "<blah>test doc</blah>";
        manager.loadDocument(document);
        expect(Blockly.mainWorkspace.clear).toHaveBeenCalled();
        expect(Blockly.Xml.textToDom).toHaveBeenCalledWith(document);
    });
    //
    // it("Should allow connection to mcu");
    // it("Should run code on mcu");
    // it("Should write as a file to mcu");
});

var chrome = {
    storage: {
        sync: {
            get: function(){},
            set: function(){}
        }
    }
};

describe("Config", function() {
    var element;
    var getSpy;
    var setSpy;
    beforeEach(function() {
        getSpy = spyOn(chrome.storage.sync, "get").and.stub().and.returnValue({});
        setSpy = spyOn(chrome.storage.sync, "set").and.stub();
    });

    it("Should default baud rate to 9600", function() {
        getSpy.and.callFake(function(param, fn) {
            expect(param).toContain('baud_rate');
            fn({});
        });
        var config = new BounceConfig(element);
        expect(config.getBaudRate()).toEqual(9600);
        expect($('#baud_rate').val()).toEqual('9600');
    });

    it("Should default timeout rate to 2 seconds", function() {
        getSpy.and.callFake(function(param, fn) {
            expect(param).toContain('serial_timeout');
            fn({});
        });
        var config = new BounceConfig(element);
        expect(config.getSerialTimeout()).toEqual(2);
        expect($('#serial_timeout').val()).toEqual('2');
    });

    it("Should store baud setting in chrome user settings when modified", function(done) {
        /* Make this async */
        setSpy.and.callFake(function() {
            expect(setSpy).toHaveBeenCalledWith({'baud_rate': 115200});
            done();
        });

        var config = new BounceConfig(element);

        expect($('#baud_rate')).toHandle("change");
        /* simulate a change to the control */
        $('#baud_rate').val(115200);
        $('#baud_rate').trigger("change");
    });


    it("Should store timeout setting in chrome user settings when modified", function(done) {
        /* Make this async */
        setSpy.and.callFake(function() {
            expect(setSpy).toHaveBeenCalledWith({'serial_timeout': 10});
            done();
        });

        var config = new BounceConfig(element);

        expect($('#serial_timeout')).toHandle("change");
        /* simulate a change to the control */
        $('#serial_timeout').val(10);
        $('#serial_timeout').trigger("change");
    });

    it("Should retrieve setting from chrome user settings", function() {
        getSpy.and.callFake(function(param, fn) {
            expect(param).toContain('baud_rate');
            fn({'baud_rate':57600});
        });
        var config = new BounceConfig(element);
        expect(config.getBaudRate()).toEqual(57600);
        expect($('#baud_rate').val()).toEqual('57600');
    });
});

describe("GeneratedCode", function() {
    var element;
    var gen_code;
    var default_code='for a=1, 100 do\n  print a\n  b=a*3\nend\n';
    beforeEach(function() {
        element = $("#code");
        gen_code = new GeneratedCode(element);
    });

    it("Should decorate a div", function() {
        expect(gen_code).not.toBeNull();
        gen_code.setCode(default_code);
    });

    it("Should hold code generated", function() {
        var code = 'print("hello world")\n';
        spyOn(element, "text").and.stub();
        gen_code.setCode(code);
        expect(element.text).toHaveBeenCalledWith('print("hello world")\n');
    });

    it("Should highlight the code when set", function() {
        spyOn(hljs, "highlightBlock").and.stub();
        gen_code.setCode(default_code);
        expect(hljs.highlightBlock).toHaveBeenCalledWith(element.get(0));
    });
    //
    // it("Should set change handler on a blockly workspace", function() {
    //     var workspace = {addChangeListener: function() {}};
    //     spyOn(workspace, "addChangeListener");
    //
    //     gen_code.setWorkspace(workspace);
    //     expect(workspace.addChangeListener).toHaveBeenCalledWith(gen_code.changed);
    // });

    it("Should set code from workspace on change", function() {
        var workspace = {addChangeListener: function() {}};
        var set_fn = null;
        spyOn(workspace, "addChangeListener").and.callFake(function(fn) {
            set_fn = fn;
        });
        spyOn(Blockly.Lua, "workspaceToCode").and.returnValue(default_code);

        spyOn(element, "text");
        gen_code.setWorkspace(workspace);
        set_fn();
        expect(Blockly.Lua.workspaceToCode).toHaveBeenCalledWith(workspace);
        expect(element.text).toHaveBeenCalledWith(default_code);

    });

    it("Should be scrollable vertically for long code");
    it("Should wrap in horizontal");
    it("Should not be editable");
    it("Should be selectable for copy to clipboard");
});

describe("OutputConsole", function() {
    var console;
    var element;

    beforeEach(function() {
        setFixtures('<div id="console"></div>');
        setFixtures('<div id="console_input"></div>');
        element = $("#console");
        spyOn(element, "append").and.stub();
        console = new OutputConsole();
        console.setup(element, $('#console_input'));
    });

    it("should write data to a div", function() {
        /* The write function should place data on the output element */
        console.write("Not a whole line");

        expect(element.append).toHaveBeenCalledWith("Not a whole line");
    });

    it("Should convert newlines to brs", function() {
        console.write("First line\nNext line");
        expect(element.append).toHaveBeenCalledWith("First line<br>Next line");
    });

    it("should have a writeline function", function() {
        console.writeLine("A whole line");
        expect(element.append).toHaveBeenCalledWith("A whole line<br>");
    });

    it("Should output an initialisation message", function() {
        expect(element.append).toHaveBeenCalledWith("Console initialised.<br>");
    });

    it("Should escape html and keep the characters literal", function() {
        console.write("if a < b then");
        expect(element.append).toHaveBeenCalledWith("if a &lt; b then");
    });

    it("Should send input box to connected code on enter", function() {
        var callback = jasmine.createSpy("dummy");
        console.lineTyped(callback);
        $('#console_input').val("A test line");
        var e = jQuery.Event("keypress");
        e.which = 13;
        $('#console_input').trigger(e);
        expect(callback).toHaveBeenCalledWith('A test line\n');
        expect($('#console_input').val()).toEqual('');
    });
});
