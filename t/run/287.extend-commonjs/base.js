function Base() {
}

Base.prototype.say = function () {
    console.log("Base");
};

module.exports = {
    Base: Base
};
