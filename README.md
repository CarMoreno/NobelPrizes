# Nobel Prize

### Context
The Nobel Prize is an international award that pays tribute to people or institutions that have contributed to humanity from different disciplines, it seeks to exalt those whose intelligence, commitment and dedication have enabled them to carry out great projects and ideals for the benefit of humanity. It has been awarded in Norway every year since 1901.
The Nobel Prize committee wants to carry out a series of studies on the data of the winners of the award, in order to obtain relevant and perhaps curious information, which will help to understand a little more about why certain people have come to win the Nobel Prize. The idea is, following this study, to find correlations between variables and so on. The following questions have then been posed:

1. How many Nobel Prizes have been awarded in the world, according to discipline?
2. Which are the countries where most Nobel Prize winners were born?
3. Have women won more Nobel Prizes than men?
4. In which disciplines do men and women mainly excel?
5. What are the top 3 South American countries with the most Nobel Prize winners?
6. Which is the top 3 countries that have had the most female award winners?
7. How many people have won more than one Nobel Prize?
8. How many shared Nobel Prizes are there per category?
9. How many shared Nobel Prizes are there in total?

### Solution

There are many ways to answer the above questions. Personally, I am going to use MongoDB to leverage the format of the data. Additionally, I resolved the questions using a MapReduce approach (I know there are situations where it is better to use other kind of strategies)

The data used was obtained from: http://api.nobelprize.org/v1/laureate.json_
