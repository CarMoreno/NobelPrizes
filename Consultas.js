// 1. ¿Cuántos Premios Nobel se han entregado en el mundo, según la disciplina?
var mapFunction = function() {
    for(row of this.prizes) {
        emit(row.category, {"year": row.year, "count": 1})
    }
}
var reduceFunction = function(year, count_year) {
    // Primero removemos los arrays con objetos duplicados, esto sucede cuando un premio nobel es otorgado a mas de una persona
    count_year = [...new Set(count_year.map(s => JSON.stringify(s)))].map(s => JSON.parse(s))
    count = 0
    for(var row of count_year) {
        count += row.count
    }
    return count;
}

db.nobel.mapReduce(
    mapFunction, reduceFunction,
    {
        "out": "count_by_category"
    }
)

db.count_by_category.find()

// 2. ¿Cuáles son los países donde han nacido la mayoría de ganadores del Premio Nobel?
var mapFunction = function() {
    emit(this.bornCountry, 1)
}

var reduceFunction = function(country, array_count) {
    return Array.sum(array_count)
}

db.nobel.mapReduce(
    mapFunction, reduceFunction,
    {
        out: "count_by_country",
        query:{ gender: {$ne: "org"}}
    }
)

db.count_by_country.find().sort({value: -1})

// 3. ¿Han sido las mujeres más galardonados que los hombres?
var mapFunction = function() {
    emit(this.gender, 1)
}

var reduceFunction = function(gender, valuesArr) {
    return Array.sum(valuesArr)
}

db.nobel.mapReduce(
    mapFunction, reduceFunction,
    {
        "out": "count_by_gender"
    }
)

db.count_by_gender.find()

// 4. ¿En qué disciplinas se destacan principalmente los hombres y las mujeres?
var mapFunction = function() {
    for (row of this.prizes) {
        emit(this.gender, row.category)
    }
}
var reduceFunction = function(gender, categories) {
    var count_physics = 0, count_medicine = 0, count_chemistry = 0, count_literature = 0, count_economics = 0, count_peace = 0 
    for (category of categories) {
        if (category == "physics") {
            count_physics += 1
        }
        if (category == "medicine") {
            count_medicine += 1
        }
        if (category == "chemistry") {
            count_chemistry += 1
        }
        if (category == "literature") {
            count_literature += 1
        }
        if (category == "economics") {
            count_economics += 1
        }
        if (category == "peace") {
            count_peace += 1
        }

    }
    return `Physics -> ${count_physics}, Medicine -> ${count_medicine}, Chemistry -> ${count_chemistry}, Literature -> ${count_literature}, Economics -> ${count_economics}, Peace -> ${count_peace}`
}

db.nobel.mapReduce(mapFunction, reduceFunction, {out: "gender_categories"})

db.gender_categories.find()

// 5. ¿Cuál es el top 3 de países sudamericanos más galardonados?
var mapFunction = function() {
    emit(this.bornCountry, 1)
}
var reduceFunction = function(country, count_countries) {
    return Array.sum(count_countries)
}

db.nobel.mapReduce(
    mapFunction, reduceFunction,
    {
        out: "ranking_sudamericanos",
        query: {"bornCountryCode": {$in: ["AR", "CO", "CL", "PE", "UY", "PY", "BO", "VE", "EC", "BR"]}}
    }
)

db.ranking_sudamericanos.find().sort({value: -1})

// 6. ¿Cuáles son los países que más mujeres galardonadas ha tenido?
var mapFunction = function() {
    emit(this.bornCountry, 1)
}
var reduceFunction = function(country, count) {
    return Array.sum(count)
}

db.nobel.mapReduce(
    mapFunction, reduceFunction,
    {
        out: "females_by_country",
        query: {gender: "female"}
    }
)
db.females_by_country.find().sort({value: -1})

// 7. ¿Cuántas personas han ganado más de un Premio Nobel?

var mapFunction = function() {
    if(this.prizes.length > 1) {
        emit(`${this.firstname} ${this.surname}`, this.prizes.length)
    }
}
var reduceFunction = function(key, value) {
    return `${value[0]} premios ganados`
}

db.nobel.mapReduce(mapFunction, reduceFunction, {out: "gte_one_prize", query:{ gender: {$ne: "org"}}})

db.gte_one_prize.find()

// 8. ¿Cuántos Premios Nobel compartidos existen por categoría?

var mapFunction = function() {
    for(prize of this.prizes) {
        if(Number.parseInt(prize.share) > 1) {
            emit(prize.category, {"year": prize.year, "count": 1})
        }
    }
}
var reduceFunction = function(category, year_count) {
    //Removemos los objetos duplicados
    year_count = [...new Set(year_count.map(s => JSON.stringify(s)))].map(s => JSON.parse(s))

    count = 0
    for(info of year_count) {
        count += info.count
    }
    return count
}

db.nobel.mapReduce(
    mapFunction, reduceFunction, {out: "nobel_shared"}
)
db.nobel_shared.find()