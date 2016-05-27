describe("BounceUi", function() {
    var ui;

    beforeEach(function() {
        ui = new BounceUI();
    });


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
        
    }); 

    it("Should output an initialisation message");
    it("Should escape html and keep the characters literal");
});