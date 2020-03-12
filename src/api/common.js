import {getDictField} from "@/api/api.js";
const PREFIX_BASE = "/etl/master";
/**
 * 获取数据字典属性
 */
export function getDictFieldValue(code){
    return getDictField(PREFIX_BASE + "/sys/dict/field/code?code=" + code)
}