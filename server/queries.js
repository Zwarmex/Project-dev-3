function categories(topValue, lastId) {
	const pagination = lastId ? `WHERE idCat > ${lastId}` : '';
	return `SELECT TOP ${topValue} * FROM categories ${pagination} ORDER BY idCat`;
}
function categoryPost(labelCat) {
	return `BEGIN TRY
				INSERT INTO categories (labelCat) values (${labelCat});
				SELECT 'Category added successfully' as message, '200' as status;
			END TRY
			BEGIN CATCH
				IF ERROR_NUMBER() = 2627
				BEGIN
					SELECT 'Error: The category already exists' as message, '409' as status;
				END
				ELSE
				BEGIN
					SELECT ' Error: Failed to execute query' as message, '400' as status;
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
function categoryPut(idCat, labelCat) {
	return `UPDATE Categories SET labelCat='${labelCat}' WHERE idCat=${idCat}`;
}
function friendPost(idUser, idFriend) {
	return `INSERT INTO friends (idUser, idFriend) VAUES (${idUser}, ${idFriend})`;
}
function friendDelete(idUser, idFriend) {
	return `DELETE FROM Friends WHERE idUser=${idUser} AND idFriend=${idFriend}`;
}
function friendGet(idUser, topValue, lastId) {
	const pagination = lastId ? `AND idFriend > ${lastId}` : '';
	return `SELECT TOP ${topValue} * FROM friends where idUser=${idUser} ${pagination} ORDER BY idFriend`;
}
function friendPut(idUser, idFriend, newIdFriend) {
	return `UPDATE Friends SET idFriend=${newIdFriend} WHERE idUser=${idUser} AND idFriend=${idFriend}`;
}
function ingredientPost(labelIng) {
	return `BEGIN TRY
				INSERT INTO ingredients (labelIng) values ('${labelIng}');
				SELECT SCOPE_IDENTITY();
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
function ingredientPut(idIng, labelIng) {
	return `UPDATE ingredients SET labelIng='${labelIng}' WHERE idIng=${idIng}; `;
}
function ingredients(topValue, lastId) {
	const pagination = lastId ? `WHERE idIng > ${lastId}` : '';
	return `SELECT TOP ${topValue} * FROM ingredients ${pagination} ORDER BY idIng`;
}
function opinionPost(textOpi, idRec, idUser) {
	return `BEGIN TRY
				INSERT INTO opinions (textOpi, idRec, idUser) VALUES ('${textOpi}', ${idRec}, ${idUser})
			END TRY
			BEGIN CATCH
				IF ERROR_NUMBER() = 2627
				BEGIN
					SELECT 'Error : The user has already a opinion' as message, '409' as status;
				END
				ELSE
				BEGIN
					SELECT 'Error : Failed to execute query' as message, '400' as status;
				END
			END CATCH`;
}
function opnionDelete(idRec, idUser) {
	return `DELETE TOP(1) FROM opinions WHERE idRec=${idRec} AND idUser=${idUser}`;
}
function opinionGet(idUser, topValue, lastId) {
	const pagination = lastId ? `AND idOpi > ${lastId}` : '';
	return `SELECT TOP ${topValue} * FROM opinions WHERE idUser=${idUser} ${pagination} ORDER BY idOpi`;
}
function opinionPut(idRec, idUser, textOpi) {
	return `UPDATE opinions SET textOpi='${textOpi}' WHERE idRec=${idRec} AND idUser=${idUser};`;
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
            VALUES ('${labelRec}', '${stepsRec}', ${numberOfPersonsRec}, ${timeRec}, ${difficultyRec}, 
			CONVERT(varbinary(max), ${imgRec}), ${idCat}, ${idUser});
			SELECT SCOPE_IDENTITY();`;
}
function recipeDelete(idRec, idUser, abilityUser) {
	let userCondition = abilityUser === 1 ? '' : `AND idUser=${idUser}`;
	return `DELETE TOP(1) FROM recipes
            WHERE idRec=${idRec} ${userCondition}`;
}
function recipeGetById(idRec) {
	return `SELECT idRec,
	labelRec,
	stepsRec,
	numberOfPersonsRec,
	timeRec,
	difficultyRec,
	CONVERT(varchar(max), imgRec) as imgRec,
	idCat,
	idUser FROM recipes where idRec=${idRec}`;
}
function recipeGetByLabel(labelRec, topValue, lastId) {
	const pagination = lastId ? `AND idRec > ${lastId}` : '';
	return `SELECT TOP ${topValue} idRec,
	labelRec,
	stepsRec,
	numberOfPersonsRec,
	timeRec,
	difficultyRec,
	CONVERT(varchar(max), imgRec) as imgRec,
	idCat,
	idUser FROM recipes WHERE labelRec LIKE '%${labelRec}%' ${pagination} ORDER BY idRec`;
}
function recipeIngredientsGet(idRec) {
	return `select idIng, quantityRecIng, unitRecIng from recipeIngredients where idRec=${idRec}`;
}
function recipeIngredientsPost(idIng, idRec, quantityRecIng, unitRecIng) {
	return `INSERT INTO recipeIngredients
			VALUES (${idIng}, ${idRec}, ${quantityRecIng},'${unitRecIng}')`;
}
function recipePut(
	idRec,
	idUser,
	labelRec,
	stepsRec,
	numberOfPersonsRec,
	timeRec,
	difficultyRec,
	imgRec,
	idCat
) {
	return `
        UPDATE recipes
        SET labelRec='${labelRec}',
            stepsRec='${stepsRec}',
            numberOfPersonsRec=${numberOfPersonsRec},
            timeRec=${timeRec},
            difficultyRec=${difficultyRec},
            imgRec='${imgRec}',
            idCat=${idCat}
        WHERE idRec=${idRec} AND idUser=${idUser};
    `;
}
function recipes(topValue, lastId, idCat) {
	let conditions = [];
	if (lastId) {
		conditions.push(`idRec > ${lastId}`);
	}
	if (idCat) {
		conditions.push(`idCat = ${idCat}`);
	}
	const whereClause = conditions.length
		? `WHERE ${conditions.join(' AND ')}`
		: '';
	return `SELECT TOP ${topValue} idRec,
        labelRec,
        stepsRec,
        numberOfPersonsRec,
        timeRec,
        difficultyRec,
        CONVERT(varchar(max), imgRec) as imgRec,
        idCat,
        idUser FROM recipes ${whereClause} ORDER BY idRec`;
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
	birthdayUser,
	saltUser
) {
	return `BEGIN TRY
				INSERT INTO users (firstnameUser, lastnameUser, abilityUser, bioUser, avatarUser, telephoneUser, mailUser, birthdayUser, passwordUser, saltUser)
				VALUES ('${firstnameUser}', '${lastnameUser}', ${abilityUser}, ${bioUser}, ${avatarUser}, ${telephoneUser}, '${mailUser}', '${birthdayUser}', '${passwordUser}', '${saltUser}')
			END TRY
			BEGIN CATCH
				IF ERROR_NUMBER() = 2627
					BEGIN
						SELECT 'Error : The user already exists' as message, '409' as status;
					END
				ELSE
					BEGIN
						SELECT 'Error : Failed to execute query' as message, '400' as status;
				END
			END CATCH`;
}
function userDelete(idUser) {
	return `
		DELETE FROM users
		WHERE idUser = ${idUser};
	`;
}
function userGetPasswordAndSaltByMail(mailUser) {
	return `SELECT saltUser, passwordUser FROM users WHERE mailUser='${mailUser}'`;
}
function userGet(mailUser) {
	return `
	SELECT idUser,
	firstnameUser,
	lastnameUser,
	abilityUser,
	bioUser,
	telephoneUser,
	mailUser,
	passwordUser,
	birthdayUser,
	saltUser,
	CONVERT(varchar(max), avatarUser) as avatarUser
	FROM users 
	WHERE mailUser='${mailUser}'`;
}
function userPut(
	idUser = null,
	firstnameUser = null,
	lastnameUser = null,
	avatarUser = null,
	bioUser = null,
	abilityUser = null,
	telephoneUser = null,
	mailUser = null,
	birthdayUser = null
) {
	return `
        UPDATE users
        SET
            ${firstnameUser !== null ? `firstname='${firstnameUser}',` : ''}
            ${lastnameUser !== null ? `lastname='${lastnameUser}',` : ''}
            ${avatarUser !== null ? `avatar=${avatarUser},` : ''}
            ${bioUser !== null ? `bio=${bioUser},` : ''}
            ${abilityUser !== null ? `ability=${abilityUser},` : ''}
            ${telephoneUser !== null ? `telephone=${telephoneUser},` : ''}
            ${mailUser !== null ? `mail='${mailUser}'` : ''}
            ${birthdayUser !== null ? `birthday='${birthdayUser}'` : ''}
        WHERE idUser=${idUser}
        AND (
            ${firstnameUser !== null ? `1=1` : '0=1'} OR
            ${lastnameUser !== null ? `1=1` : '0=1'} OR
            ${avatarUser !== null ? `1=1` : '0=1'} OR
            ${bioUser !== null ? `1=1` : '0=1'} OR
            ${abilityUser !== null ? `1=1` : '0=1'} OR
            ${telephoneUser !== null ? `1=1` : '0=1'} OR
            ${mailUser !== null ? `1=1` : '0=1'} OR
            ${birthdayUser !== null ? `1=1` : '0=1'}
        );
    `.replace(/,\s+$/, '');
}
function userPutAvatar(idUser, avatarUser) {
	return `
        UPDATE users
        SET 
            avatarUser=CONVERT(varbinary(max), '${avatarUser}')
        WHERE idUser=${idUser}`;
}
function userPutPassword(idUser = null, passwordUser = null, saltUser = null) {
	return `
        UPDATE users
        SET
            passwordUser='${passwordUser}',
			saltUser='${saltUser}'
        WHERE idUser=${idUser};`;
}
function userGetFavoritesRecipes(idUser) {
	return `SELECT * FROM userRecipesFav WHERE idUser=${idUser}`;
}
function userPostFavoritesRecipes(idUser, idRec) {
	return `BEGIN TRY
				INSERT INTO userRecipesFav VALUES(${idRec},${idUser});
				SELECT 'Recipe added into favorites' as message, '200' as status;
			END TRY
			BEGIN CATCH
				IF ERROR_NUMBER() = 2627 BEGIN
					SELECT 'The user alredy like the recipe' as message, '409' as status;
				END
				ELSE BEGIN
					SELECT 'Failed to execute query' as message, '400' as status;
				END
			END CATCH`;
}
function userDeleteFavoritesRecipes(idUser, idRec) {
	return `BEGIN TRY
				DELETE FROM userRecipesFav WHERE idUser=${idUser} AND idRec=${idRec};
				IF @@ROWCOUNT = 0
					RAISERROR('No favorite found to delete', 16, 1);
				ELSE
					SELECT 'Favorite deleted' as message;
			END TRY
			BEGIN CATCH
				SELECT ERROR_MESSAGE() as message;
			END CATCH`;
}
function userGetIsFavoriteRecipe(idUser, idRec) {
	return `SELECT CASE WHEN EXISTS (
				SELECT * 
				FROM userRecipesFav 
				WHERE idUser=${idUser} AND idRec=${idRec}
			)
			THEN CAST(1 AS BIT)
			ELSE CAST(0 AS BIT) END`;
}
function userRecipesGet(idUser, topValue, lastId) {
	const pagination = lastId ? `AND idRec > ${lastId}` : '';
	return `SELECT TOP ${topValue} 
	idRec,
	labelRec,
	stepsRec,
	numberOfPersonsRec,
	timeRec,
	difficultyRec,
	CONVERT(varchar(max), imgRec) as imgRec,
	idCat,
	idUser 
	FROM recipes 
	WHERE idUser=${idUser} ${pagination}
	ORDER BY idRec`;
}
module.exports = {
	categories: categories,
	categoryPost: categoryPost,
	categoryDelete: categoryDelete,
	categoryGetById: categoryGetById,
	categoryGetByLabel: categoryGetByLabel,
	categoryPut: categoryPut,
	friendPost: friendPost,
	friendDelete: friendDelete,
	friendGet: friendGet,
	friendPut: friendPut,
	ingredientPost: ingredientPost,
	ingredientDelete: ingredientDelete,
	ingredientGetById: ingredientGetById,
	ingredientGetByLabel: ingredientGetByLabel,
	ingredientPut: ingredientPut,
	ingredients: ingredients,
	opinionPost: opinionPost,
	opnionDelete: opnionDelete,
	opinionGet: opinionGet,
	opinionPut: opinionPut,
	recipePost: recipePost,
	recipeDelete: recipeDelete,
	recipeGetById: recipeGetById,
	recipeGetByLabel: recipeGetByLabel,
	recipeIngredientsGet: recipeIngredientsGet,
	recipeIngredientsPost: recipeIngredientsPost,
	recipePut: recipePut,
	recipes: recipes,
	userPost: userPost,
	userDelete: userDelete,
	userGetPasswordAndSaltByMail: userGetPasswordAndSaltByMail,
	userGet: userGet,
	userPut: userPut,
	userPutAvatar: userPutAvatar,
	userPutPassword: userPutPassword,
	userGetFavoritesRecipes: userGetFavoritesRecipes,
	userPostFavoritesRecipes: userPostFavoritesRecipes,
	userDeleteFavoritesRecipes: userDeleteFavoritesRecipes,
	userGetIsFavoriteRecipe: userGetIsFavoriteRecipe,
	userRecipesGet: userRecipesGet,
};
