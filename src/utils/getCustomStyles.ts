import { StylesConfig } from 'react-select';
import { SelectedOption } from '../types/SelectedOption';

export const getCustomStyles = (
  mode: 'light' | 'dark'
): StylesConfig<SelectedOption> => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: mode === 'dark' ? '#1d1d1d' : '#ffffff',
    color: mode === 'dark' ? '#ffffff' : '#000000',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: mode === 'dark' ? '#1d1d1d' : '#ffffff',
    color: mode === 'dark' ? '#ffffff' : '#000000',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: mode === 'dark' ? '#ffffff' : '#000000',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? mode === 'dark'
        ? '#90caf9'
        : '#f0f0f0'
      : mode === 'dark'
      ? '#1d1d1d'
      : '#ffffff',
    color: mode === 'dark' ? '#ffffff' : '#000000',
    '&:hover': {
      backgroundColor: mode === 'dark' ? '#333333' : '#f0f0f0',
    },
  }),
  input: (provided) => ({
    ...provided,
    color: mode === 'dark' ? '#ffffff' : '#000000',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: mode === 'dark' ? '#ffffff' : '#000000',
  }),
});

export interface CustomStyles {
  control: (provided: any) => any;
  menu: (provided: any) => any;
  singleValue: (provided: any) => any;
  option: (provided: any, state: any) => any;
  input: (provided: any) => any;
  placeholder: (provided: any) => any;
}
