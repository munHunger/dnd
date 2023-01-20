var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import yaml from "js-yaml";
import * as fs from "fs";
function nextQry(query) {
    if (query.substring(1).split("").includes(".")) {
        return query.substring(1).split(".").slice(1).join(".");
    }
}
function arrayQuery(array, query) {
    if (query.startsWith("[")) {
        console.log("array search");
        const item = eval("array" + query.substring(0, query.indexOf("]") + 1));
        if (item && typeof item === "object")
            return anyQuery(item, nextQry(query));
        if (item)
            return item;
        return;
    }
    if (!query.startsWith(".")) {
        query = "." + query;
    }
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (typeof item === "object") {
            const res = anyQuery(item, query);
            if (res) {
                newArray.push(res);
            }
        }
        else if (eval("item" + query)) {
            newArray.push(item);
        }
    }
    return newArray;
}
function objectQuery(obj, query) {
    if (!query.startsWith(".")) {
        query = "." + query;
    }
    const next = nextQry(query);
    const current = eval("obj" + query.split(".").slice(0, 2).join("."));
    if (next && current)
        return anyQuery(current, next);
    if (current) {
        if (typeof current === "number" || typeof current === "string")
            return current;
        return obj;
    }
}
function anyQuery(anyData, query) {
    if (Array.isArray(anyData))
        return arrayQuery(anyData, query);
    return objectQuery(anyData, query);
}
export function queryWiki(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = "../segow";
        const dir = yield fs.promises.readdir(baseUrl);
        console.log(dir);
        const yamlFiles = yield Promise.all(dir
            .filter((v) => v.endsWith(".yaml"))
            .map((v) => fs.promises.readFile(baseUrl + "/" + v, "utf-8")));
        const yamlData = yamlFiles.map((v) => yaml.load(v));
        const queryResult = anyQuery(yamlData, query.split(";")[0]).filter((v) => v.length > 0);
        if (query.split(";").length > 1) {
            return anyQuery(queryResult, query.split(";")[1].trim()).flat(10);
        }
        console.log(queryResult);
        return queryResult;
    });
}
export default {
    queryWiki,
};
//# sourceMappingURL=index.js.map