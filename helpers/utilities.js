import * as Yup from 'yup';

const utilities = {    

    deleteConfirm: async(t) => {
        try {

            let result = await swal({
                title: t('common:alertConfirmTitle'),
                text: t('common:alertConfirmText'),
                icon: 'warning',
                buttons: true,
                dangerMode: true
            });
            return result;
        } catch (e) {
            console.error(e);
        }

    },
    confirm: async(t) => {
        try {

            let result = await swal({
                title: t('common:alertConfirmTitleCloseOut'),
                text: t('common:alertConfirmTextCloseOut'),
                icon: 'warning',
                buttons: true,
                dangerMode: true
            });
            return result;
        } catch (e) {
            console.error(e);
        }

    },
    pivotArray: async(dataArray, rowIndex, colIndex, dataIndex) => {        
        var result = {}, ret = [];
        var newCols = [];
        for (var i = 0; i < dataArray.length; i++) {
 
            if (!result[dataArray[i][rowIndex]]) {
                result[dataArray[i][rowIndex]] = {};
            }
            result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = dataArray[i][dataIndex];
 
            //To get column names
            if (newCols.indexOf(dataArray[i][colIndex]) == -1) {
                newCols.push(dataArray[i][colIndex]);
            }
        }
 
        newCols.sort();
        var item = [];
 
        //Add Header Row
        item.push('Item');
        item.push.apply(item, newCols);
        ret.push(item);
 
        //Add content 
        for (var key in result) {            
            item = [];
            item.push(key);
            for (var i = 0; i < newCols.length; i++) {
                item.push(result[key][newCols[i]] || "-");
            }
            ret.push(item);
        }
        return ret;
    },
    arrayToHTMLTable: async(myArray) => {
        var result = "<table border='1' cellpadding='7' cellspacing='0'>";
        for (var i = 0; i < myArray.length; i++) {
            result += "<tr>";
            for (var j = 0; j < myArray[i].length; j++) {
                result += "<td>" + myArray[i][j] + "</td>";
            }
            result += "</tr>";
        }
        result += "</table>";

        return result;
    },
    createValidationSchema: (fields) => {
        //NOTA: El arreglo debe estar formado con la siguiente estructura:
        //      const fields = [ { name: 'test', validationType: 'number', validations: [ { type: 'min', params: [0, "Valor Minimo 0"] }, { type: 'test', params: [ 'validateTotalSectionQuantity', "Es mayor a X", (value) => validateTotalSectionQuantity(1) > value ] }] }];
        const schema = fields.reduce((schema, field) => {
            const { name, validationType, validationTypeError, validations = [] } = field
            const isObject = name.indexOf('.') >= 0
        
            if (!Yup[validationType]) {
              return schema
            }
            
            let validator = Yup[validationType]().typeError(validationTypeError || '')
            validations.forEach(validation => {
              const { params, type } = validation
              if (!validator[type]) {
                return
              }              
              validator = validator[type](...params)
            })           
        
            if (!isObject) {
              return schema.concat(Yup.object().shape({ [name]: validator }))
            }
        
            const reversePath = name.split('.').reverse()
            const currNestedObject = reversePath.slice(1).reduce((yupObj, path, index, source) => {
              if (!isNaN(path)) {
                return { array: Yup.array().of(yup.object().shape(yupObj)) }
              }
              if (yupObj.array) {
                return { [path]: yupObj.array }
              }
              return { [path]: Yup.object().shape(yupObj) }
            }, { [reversePath[0]]: validator })
        
            const newSchema = Yup.object().shape(currNestedObject)
            return schema.concat(newSchema)
          }, Yup.object().shape({}))
        
          return schema
    }

}

export default utilities;