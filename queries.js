// 1. How many Nobel Prizes have been awarded in the world, according to discipline?
var mapFunction = function() {
    for(row of this.prizes) {
        emit(row.category, {"year": row.year, "count": 1})
    }
}
var reduceFunction = function(year, count_year) {
    // Firstly, we are going to remove the arrays with duplicated objects, this happens when a nobel prize is awarded to more than one person.
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

// 2. Which are the countries where most Nobel Prize winners were born?
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

// 3. Have women won more Nobel Prizes than men?
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

// 4. In which disciplines do men and women mainly excel?
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

// 5. What are the top 3 South American countries with the most Nobel Prize winners?
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

// 6. Which is the top 3 countries that have had the most female award winners?
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

// 7. How many people have won more than one Nobel Prize?

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

// 8. How many shared Nobel Prizes are there per category?

var mapFunction = function() {
    for(prize of this.prizes) {
        if(Number.parseInt(prize.share) > 1) {
            emit(prize.category, {"year": prize.year, "count": 1})
        }
    }
}
var reduceFunction = function(category, year_count) {
    //Remove duplicated objects
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