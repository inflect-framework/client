// import { StylesConfig } from 'react-select';
// import { SelectedOption } from '../types/SelectedOption';

// export const getCustomStyles = (
//   mode: 'light' | 'dark'
// ): StylesConfig<SelectedOption> => ({
//   control: (provided) => ({
//     ...provided,
//     backgroundColor: mode === 'dark' ? '#1d1d1d' : '#ffffff',
//     color: mode === 'dark' ? '#ffffff' : '#000000',
//   }),
//   menu: (provided) => ({
//     ...provided,
//     backgroundColor: mode === 'dark' ? '#1d1d1d' : '#ffffff',
//     color: mode === 'dark' ? '#ffffff' : '#000000',
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: mode === 'dark' ? '#ffffff' : '#000000',
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected
//       ? mode === 'dark'
//         ? '#90caf9'
//         : '#f0f0f0'
//       : mode === 'dark'
//       ? '#1d1d1d'
//       : '#ffffff',
//     color: mode === 'dark' ? '#ffffff' : '#000000',
//     '&:hover': {
//       backgroundColor: mode === 'dark' ? '#333333' : '#f0f0f0',
//     },
//   }),
//   input: (provided) => ({
//     ...provided,
//     color: mode === 'dark' ? '#ffffff' : '#000000',
//   }),
//   placeholder: (provided) => ({
//     ...provided,
//     color: mode === 'dark' ? '#ffffff' : '#000000',
//   }),
// });

// export interface CustomStyles {
//   control: (provided: any) => any;
//   menu: (provided: any) => any;
//   singleValue: (provided: any) => any;
//   option: (provided: any, state: any) => any;
//   input: (provided: any) => any;
//   placeholder: (provided: any) => any;
// }

import { StylesConfig } from 'react-select';
import { SelectedOption } from '../types/SelectedOption';

export const getCustomStyles = (
  mode: 'light' | 'dark'
): StylesConfig<SelectedOption> => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: mode === 'dark' ? '#0A0E1A' : '#ffffff',
    color: mode === 'dark' ? '#ffffff' : '#0A0E1A',
    borderColor: mode === 'dark' ? '#2A2E3A' : '#cccccc',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: mode === 'dark' ? '#0A0E1A' : '#ffffff',
    color: mode === 'dark' ? '#ffffff' : '#0A0E1A',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: mode === 'dark' ? '#ffffff' : '#0A0E1A',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? mode === 'dark'
        ? '#00D1A1'
        : '#E6F7F2'
      : mode === 'dark'
      ? '#0A0E1A'
      : '#ffffff',
    color: state.isSelected
      ? mode === 'dark'
        ? '#0A0E1A'
        : '#00D1A1'
      : mode === 'dark'
      ? '#ffffff'
      : '#0A0E1A',
    '&:hover': {
      backgroundColor: mode === 'dark' ? '#1A1E2A' : '#E6F7F2',
    },
  }),
  input: (provided) => ({
    ...provided,
    color: mode === 'dark' ? '#ffffff' : '#0A0E1A',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: mode === 'dark' ? '#8A8E9A' : '#4A4E5A',
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
