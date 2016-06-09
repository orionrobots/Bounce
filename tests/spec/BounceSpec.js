describe("BounceUi", function() {
    var ui;

    beforeEach(function() {
        ui = new BounceUI();
    });

    it("Should allow a GeneratedCode window to be connected");
});

describe("Config", function() {
    var element;

    beforeEach(function() {
        element = $(new HTMLDivElement());
    });

    it("Should have construct with a passed div", function() {
        var config = new BounceConfig(element);
    });
    it("Should have a baud rate control", function() {
        var baudControl = $(new HTMLSelectElement());
        spyOn(element, "find").and.returnValue([baudControl]);
        var config = new BounceConfig(element);
    });
    it("Should have a function to get the current baud rate setting");
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
        gen_code.set_code(default_code);
    });

    it("Should hold code generated", function() {
        var code = 'print("hello world")\n';
        spyOn(element, "text").and.stub();
        gen_code.set_code(code);
        expect(element.text).toHaveBeenCalledWith('print("hello world")\n');
    });

    it("Should highlight the code when set", function() {
        spyOn(hljs, "highlightBlock").and.stub();
        gen_code.set_code(default_code);
        expect(hljs.highlightBlock).toHaveBeenCalledWith(element.get(0));
    });
    //
    // it("Should set change handler on a blockly workspace", function() {
    //     var workspace = {addChangeListener: function() {}};
    //     spyOn(workspace, "addChangeListener");
    //
    //     gen_code.set_workspace(workspace);
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
        gen_code.set_workspace(workspace);
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