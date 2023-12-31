"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategory = void 0;
var Type_1 = require("../Type/Type");
var SubCategory = /** @class */ (function () {
    function SubCategory(current, invalidData) {
        this.subCategory = current.Sub_Category__c;
        this.department = current.Department__c;
        this.category = current.Category__c;
        this.data = new Map();
        this.invalidData = invalidData;
        this.surchargeTotal = 0;
        this.numTypes = 0;
        this.total = 0;
        this.addNode(current);
    }
    /* Primary Functions */
    SubCategory.prototype.addNode = function (current) {
        var type = current.Type__c;
        if (this.data.has(type)) {
            this.proceed(current);
        }
        else if (!this.data.has(type)) {
            this.addType(current);
            this.numTypes++;
        }
        else {
            throw new Error("Failed to add JSON.stringify".concat(current));
        }
    };
    /* Helper Functions */
    SubCategory.prototype.proceed = function (current) {
        this.data.get(current.Type__c).addRow(current);
    };
    SubCategory.prototype.addType = function (current) {
        this.data.set(current.Type__c, new Type_1.Type(current, this.invalidData));
    };
    /* Getters & Setters */
    SubCategory.prototype.getTotal = function () {
        return this.total;
    };
    SubCategory.prototype.setTotal = function (childrenSum) {
        this.total = childrenSum;
    };
    SubCategory.prototype.getSurchargeTotal = function () {
        return this.surchargeTotal;
    };
    SubCategory.prototype.setSurchargeTotal = function (childrenSum) {
        this.surchargeTotal = childrenSum;
    };
    SubCategory.prototype.getSubCategory = function () {
        return this.subCategory;
    };
    SubCategory.prototype.getData = function () {
        return this.data;
    };
    // Returns number of types that exist within this subcategory
    SubCategory.prototype.getNumChildren = function () {
        return this.numTypes;
    };
    // Returns number of .csv rows that were grouped into this specific subcategory
    SubCategory.prototype.getNumRows = function () {
        var _this = this;
        var res = 0;
        this.data.forEach(function (value, key) { return (res += _this.data.get(key).getDataSize()); });
        return res;
    };
    SubCategory.prototype.getDepartment = function () {
        return this.department;
    };
    SubCategory.prototype.getCategory = function () {
        return this.category;
    };
    return SubCategory;
}());
exports.SubCategory = SubCategory;
