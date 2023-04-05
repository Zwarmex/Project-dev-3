function categories(topValue, orderValue, sortValue) {
	return `SELECT TOP ${topValue} * FROM categories ORDER BY ${orderValue} ${sortValue}`;
}
function categoryPost(labelCat) {
	return `BEGIN TRY
    INSERT INTO categories (labelCat) values (${labelCat});
  END TRY
  BEGIN CATCH
    IF ERROR_NUMBER() = 2627
    BEGIN
      SELECT 'Error: The category already exists' as message;
    END
    ELSE
    BEGIN
      SELECT ' Error: Failed to execute query' as message;
    END
  END CATCH`;
}
function categoryDelete(idCat) {
	return `DELETE TOP(1) FROM recipes where idCat=${idCat}`;
}
function categoryGetById(idCat) {
	return `SELECT  * FROM categories where idCat=${idCat}`;
}
function categoryGetByLabel(labelCat) {
	return `SELECT  * FROM categories where labelCat='${labelCat}'`;
}
function friendPost(idUser, idFriend) {
	return `INSERT INTO friends (idUser, idFriend) VAUES (${idUser}, ${idFriend})`;
}
function friendGet(idUser, topValue, orderValue, sortValue) {
	return `SELECT TOP ${topValue} * FROM friends where idUser=${idUser} ORDER BY ${orderValue} ${sortValue}`;
}
function ingredientPost(labelIng) {
	return `BEGIN TRY
				INSERT INTO ingredients (labelIng) values (${labelIng});
			END TRY
			BEGIN CATCH
				IF ERROR_NUMBER() = 2627
				BEGIN
					SELECT 'Error: The ingredient ${labelIng} already exists' as message;
				END
				ELSE
				BEGIN
					SELECT 'Error: Failed to execute query' as message;
				END
			END CATCH`;
}
function ingredientDelete(idIng) {
	return `DELETE TOP(1) FROM ingredients where idIng=${idIng}`;
}
function ingredientGetById(idIng) {
	return `SELECT * FROM ingredients where idIng=${idIng}`;
}
function ingredientGetByLabel(labelIng) {
	return `SELECT * FROM ingredients where labelIng='${labelIng}'`;
}
function ingredients(topValue, orderValue, sortValue) {
	return `SELECT TOP ${topValue} * FROM ingredients ORDER BY ${orderValue} ${sortValue}`;
}
function opinionPost(textOpi, idRec, idUser) {
	return `INSERT INTO opinions (textOpi, idRec, idUser) VALUES (${textOpi}, ${idRec}, ${idUser})`;
}
function opnionDelete(idRec, idUser) {
	return `DELETE TOP(1) FROM opinions WHERE idRec=${idRec} AND idUser=${idUser}`;
}
function opinionGet(idUser, topValue, orderValue, sortValue) {
	return `SELECT, TOP ${topValue} * FROM opinions WHERE idUser=${idUser} ORDER BY ${orderValue} ${sortValue}`;
}
function recipePost(
	labelRec,
	stepsRec,
	numberOfPersonsRec,
	timeRec,
	difficultyRec,
	imgRec,
	idCat,
	idUser
) {
	return `INSERT INTO recipes (labelRec, stepsRec, numberOfPersonsRec, timeRec, difficultyRec, imgRec, idCat, idUser)
            VALUES (${labelRec}, ${stepsRec}, ${numberOfPersonsRec}, ${timeRec}, ${difficultyRec}, ${imgRec}, ${idCat}, ${idUser})`;
}
function recipeDelete(idRec, idUser) {
	return `DELETE TOP(1) FROM recipes
            WHERE idRec=${idRec} AND idUser=${idUser}`;
}
function recipeGetById(idRec) {
	return `SELECT * FROM recipes where idRec=${idRec}`;
}
function recipeGetByLabel(labelRec, topValue, orderValue, sortValue) {
	return `SELECT TOP ${topValue} * FROM recipes WHERE labelRec LIKE '%${labelRec}%' ORDER BY ${orderValue} ${sortValue}`;
}
function recipes(topValue, orderValue, sortValue) {
	return `SELECT TOP ${topValue} * FROM recipes ORDER BY ${orderValue} ${sortValue}`;
}
function userPost(
	firstnameUser,
	lastnameUser,
	abilityUser,
	avatarUser,
	bioUser,
	telephoneUser,
	mailUser,
	passwordUser,
	birthdayUser
) {
	return `BEGIN TRY
			INSERT INTO users (firstnameUser, lastnameUser, abilityUser, avatarUser, bioUser, telephoneUser, mailUser, passwordUser, birthdayUser)
			VALUES (${firstnameUser}, ${lastnameUser}, ${abilityUser}, ${avatarUser}, ${bioUser}, ${telephoneUser}, ${mailUser}, ${passwordUser}, ${birthdayUser})
		END TRY
		BEGIN CATCH
			IF ERROR_NUMBER() = 2627
				BEGIN
					SELECT 'Error: The user already exists' as message;
				END
			ELSE
				BEGIN
					SELECT 'Error: Failed to execute query' as message;
			END
		END CATCH`;
}
function userGet(mailUser, passwordUser) {
	return `SELECT * FROM users WHERE mailUser=${mailUser} AND passwordUser=${passwordUser}`;
}

module.exports = {
	categories: categories,
	categoryPost: categoryPost,
	categoryDelete: categoryDelete,
	categoryGetById: categoryGetById,
	categoryGetByLabel: categoryGetByLabel,
	friendPost: friendPost,
	friendGet: friendGet,
	ingredientPost: ingredientPost,
	ingredientDelete: ingredientDelete,
	ingredientGetById: ingredientGetById,
	ingredientGetByLabel: ingredientGetByLabel,
	ingredients: ingredients,
	opinionPost: opinionPost,
	opnionDelete: opnionDelete,
	opinionGet: opinionGet,
	recipePost: recipePost,
	recipeDelete: recipeDelete,
	recipeGetById: recipeGetById,
	recipeGetByLabel: recipeGetByLabel,
	recipes: recipes,
	userPost: userPost,
	userGet: userGet,
};
