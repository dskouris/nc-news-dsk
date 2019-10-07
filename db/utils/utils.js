exports.formatDates = list => {
  let newList = list.concat([]);
  if (newList.length < 1) {
    return [];
  } else
    for (let i = 0; i < newList.length; i++) {
      newList[i].created_at = new Date(newList[i].created_at);
    }
  return newList;
};

exports.makeRefObj = list => {
  if (list.length < 1) {
    return [];
  }
  let refObj = {};

  list.forEach(row => {
    refObj[row.title] = row.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  if (comments.length < 1) {
    return [];
  }
  let newComments = comments.concat([]);
  let newArr = [];
  newComments.forEach(comment => {
    let newObj = { ...comment };
    newObj.author = newObj.created_by;
    delete newObj.created_by;
    newObj.article_id = articleRef[newObj.belongs_to];
    delete newObj.belongs_to;
    newObj.created_at = new Date(newObj.created_at);
    newArr.push(newObj);
  });
  return newArr;
};
