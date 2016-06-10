describe("BounceUi", function() {
    var ui;

    beforeEach(function() {
        ui = new BounceUI();
    });

    it("Should allow a GeneratedCode window to be connected");
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
        setFixtures('<select id="baud_rate">' +
                    '<option value="9600" selected="true">9600</option>' +
                    '<option value="57600">57600</option>' +
                    '<option value="115200">115200</option>' +
                    '</select>'
        );

        getSpy = spyOn(chrome.storage.sync, "get").and.stub().and.returnValue({});
        setSpy = spyOn(chrome.storage.sync, "set").and.stub();
    });
    it("Should default to 9600", function() {
        getSpy.and.callFake(function(param, fn) {
            expect(param).toEqual('baud_rate');
            fn({});
        });
        var config = new BounceConfig(element);
        expect(config.getBaudRate()).toEqual(9600);
        expect($('#baud_rate').val()).toEqual('9600');
    });
    it("Should store setting in chrome user settings when modified", function() {
        var config = new BounceConfig(element);
        /* simulate a change to the control */
        $('#baud_rate').val(115200);
        $('#baud_rate').trigger("change");
        expect(setSpy).toHaveBeenCalledWith({'baud_rate': 115200});
    });
    it("Should retrieve setting from chrome user settings", function() {
        getSpy.and.callFake(function(param, fn) {
            expect(param).toEqual('baud_rate');
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
        element = $("#console");
        spyOn(element, "append").and.stub();
        console = new OutputConsole(element);
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
});