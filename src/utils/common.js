/**
 * 数组是否包含某值
 * @param {数组} arr 
 * @param {值} value 
 */
export function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true
        }
    }
    return false
}