import axios from 'axios';
import { getSingleCategory } from '../../../../api/read/category.req';
import { env } from '../../../../api/read/environment';
import { updateSingleService } from '../../../../api/read/services.req';
import { notify } from '../../../../utils/toast';
import { addLoggingData } from '../logger/logger';

const base_url = `${env}`;

const auth = JSON.parse(window.localStorage.getItem('MDA__TOKEN'));
const page = window.location.pathname.split('/')[3];
const mda = window.location.pathname.split('/')[1];

// helper for formatted name
export const formattedName = (str) => {
  return str.replaceAll(' ', '').replaceAll(',', '_').replaceAll('&', '_').toLowerCase();
};

const addToService = async (data, categoryName) => {
  try {
    const response = await axios.post(`${base_url}/services/add/single`, {
      ...data,
      formattedName: data?.formattedName
        ? [...data?.formattedName, formattedName(categoryName)]
        : [formattedName(categoryName)],
      categories: data?.categories ? [...data?.categories, categoryName] : [categoryName],
    });

    if (response.status === 200) {
      addLoggingData({
        initiator: `${auth?.firstname} ${auth?.lastname}`.trim(),
        mda: data.name || auth?.mda,
        activity: `${auth?.firstname} ${auth?.lastname} added a new service - ${data.name}`,
      });
      return response.data;
    }

    notify.error(response.data?.message || 'Failed to add service');
    return [];
  } catch (error) {
    console.error('Error adding service:', error);
    notify.error(error.response?.data?.message || 'An error occurred while adding the service');
    return [];
  }
};

// add category
export const addCategory = async (data) => {
  try {
    const response = await axios.post(`${base_url}/category/add`, data);
    return response.status === 200 ? response.data : [];
  } catch (error) {
    console.error('Error adding category:', error);
    return [];
  }
};

// Add new service
export const addSingleService = async (data, categoryName) => {
  if (!categoryName) {
    notify.error('Category name is required');
    return [];
  }

  try {
    const category = await getSingleCategory(formattedName(categoryName));

    if (category?.data?.length > 0) {
      return await addToService(data, categoryName);
    }

    // If category doesn't exist, create it first
    const newCategory = await addCategory({
      name: `${categoryName}`,
      keywords: [],
      short: `Explore and get up-to-date services for ${categoryName} through integrated digital portals.`,
      icon: {},
    });

    if (newCategory?.status === 'ok' && newCategory?.data?.length > 0) {
      return await addToService(data, categoryName);
    }

    throw new Error('Failed to create category');
  } catch (error) {
    console.error('Error in addSingleService:', error);
    notify.error('Failed to process service addition');
    return [];
  }
};

// update existing service
export const addExistingService = async (data, categoryName) => {
  try {
    const response = await updateSingleService(data._id, {
      formattedName: data?.formattedName
        ? [...data?.formattedName, formattedName(categoryName)]
        : [formattedName(categoryName)],
      categories: data?.categories ? [...data?.categories, categoryName] : [categoryName],
    });

    if (response.status === 'ok') {
      addLoggingData({
        initiator: `${auth?.firstname} ${auth?.lastname}`.trim(),
        mda: data.name || auth?.mda,
        activity: `${auth?.firstname} ${auth?.lastname} added a new service - ${data.name}`,
      });
      return response.data;
    }

    notify.error(response.data?.message || 'Failed to add service');
    return [];
  } catch (error) {
    console.error('Error adding service:', error);
    notify.error(error.response?.data?.message || 'An error occurred while adding the service');
    return [];
  }
};

export const isExistingService = (services, name) => {
  return services?.find((service) => service.name === name);
};
