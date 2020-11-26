function evaluateRelationalExpression(param1,op, param2) {
    switch(op) {
        case "<":
            return param1 < param2;
        case ">":
            return param1 > param2;
        case "==":
            return param1 == param2;
        case "!=":
            return param1 != param2;
        case "<=":
            return param1 <= param2;
        case ">=":
            return param1 >= param2;
        default:
            return false;
    }
}
function compileLogicalExpression(condition){ //compiles conditions of format x>5 && y>10 || z==9
    let andArr = condition.split("&&"),orArr;
    let toBeAndedArr = [],toBeOrArr = [];
    andArr.forEach(sub_condition => {
        sub_condition = sub_condition.trim();
        orArr = sub_condition.split("||");
        if(orArr.length>1){
            toBeOrArr = toBeOrArr.concat(orArr);
        }else{
            toBeAndedArr = toBeAndedArr.concat(compileRelationalExpression(sub_condition))
        }
    })
    toBeOrArr = toBeOrArr.map(sub_condition => compileRelationalExpression(sub_condition.trim()))
    return {"and" : toBeAndedArr, "or" : toBeOrArr}
}
function computeLogicalExpression(expObj,data){ //once the expressions are compiled we just need to check for every iteration of the JSON
   let orRes = false,andRes = true, toAnd = expObj.and,toOr = expObj.or;
    if(toOr.length){
    toOr.forEach(or_cond => {
        orRes = orRes || evaluateRelationalExpression(data[or_cond.exp[0]],or_cond.op,or_cond.exp[1])
        })
    }
    if(toAnd.length){
        toAnd.forEach(and_cond => {
            andRes = andRes && evaluateRelationalExpression(data[and_cond.exp[0]],and_cond.op,and_cond.exp[1])
        })
   }
   return (toOr.length && toAnd.length)?(andRes && orRes):(toOr.length?orRes:andRes)
}
function compileRelationalExpression(condition){ //compiles conditions of format x>5
    let pattern = /[{<|>|==|!=|>=|<=}]/g;
    let match   = condition.match(pattern);
    let operator = match.join("");
    let exp = condition.split(operator);
    exp = exp.map(str=> str.trim()); //remove white space from array
    return {"op":operator,exp}
}

export {evaluateRelationalExpression,compileLogicalExpression,computeLogicalExpression,compileRelationalExpression}