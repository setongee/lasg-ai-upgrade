import { format } from 'date-fns';

export const formatCategoryName = (name) => {
  return name.replaceAll(' ', '').replaceAll(',', '_').replaceAll('&', '_').toLowerCase();
};

export const formatDate = (date) => {
  return format(new Date(date), "dd MMM'.' yyyy");
};

export const formatDate3 = (date) => {
  return format(new Date(date), 'dd MMMM yyyy');
};

export const formatDate2 = (date) => {
  return format(new Date(date), 'dd-MM-yyyy');
};

export const decodeURL = (url) => {
  const newURL = decodeURI(url);
  return newURL;
};

//Truncate text helper created by Setonji

export const truncateText = (str, max) => {
  if (str.length > max) {
    const newText = str.substring(0, max) + '...';
    return newText;
  } else {
    return str;
  }
};

// calculate reading time for anything

export const readingTime = (content) => {
  const div = document.createElement('div');
  div.innerHTML = content;
  const text = div.innerText;
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);

  return time;
};

//convert in full to title case

export const convertToTitleCase = (str) => {
  var i, j, str, lowers, uppers;
  str = str.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string

  lowers = [
    'A',
    'An',
    'The',
    'And',
    'But',
    'Or',
    'For',
    'Nor',
    'As',
    'At',
    'By',
    'For',
    'From',
    'In',
    'Into',
    'Near',
    'Of',
    'On',
    'Onto',
    'To',
    'With',
  ];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), function (txt) {
      return txt.toLowerCase();
    });

  // Certain words such as initialisms or acronyms should be left uppercase

  uppers = ['Id', 'Tv', 'Lasg', 'Lasu', 'Sgbv', 'Eko'];

  for (i = 0, j = uppers.length; i < j; i++)
    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase());

  return str;
};

export const sortArray = async (data, field) => {
  let sortData = data?.sort((a, b) =>
    a[field].toLowerCase().localeCompare(b[field].toLowerCase(), 'en', { sensitivity: 'accent' })
  );

  return await sortData;
};

export const sortArrayByNumber = async (data, field) => {
  let sortData = data.sort((a, b) => {
    return Number(a[field]) - Number(b[field]);
  });

  return await sortData;
};
