import { useField, useFormikContext } from "formik";
import Select from "react-select";

// eslint-disable-next-line react/prop-types
export const FormikSelect = ({
  name,
  options,
  placeholder,
  _onchange,
  ...restProps
}) => {
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();
  const handleChange = (option) => {
    _onchange(name, option.value);
    setFieldValue(name, option.value);
  };
  const getValue = () => {
    if (options) {
      // eslint-disable-next-line react/prop-types
      return options.find((option) => option.value === field.value);
    } else {
      return "";
    }
  };
  const customStyles = {
    menuList: (base) => ({
      ...base,
      "::-webkit-scrollbar": {
        display: "none",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "#000",
      backgroundColor: state.isSelected
        ? "#cc6cff"
        : state.isFocused
        ? "#edcdff"
        : "white",
    }),
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#cc6cff" : "#cc6cff",
      boxShadow: state.isFocused ? "0 0 0 1px white" : "#cc6cff",
      border: "solid 2px #cc6cff",
      borderRadius: "16px",
      "&:hover": {
        borderColor: "#cc6cff",
      },
      minHeight: "48px",
      height: "48px",
    }),
  };
  return (
    <Select
      styles={customStyles}
      {...restProps}
      name={name}
      value={getValue()}
      onChange={handleChange}
      options={options}
      placeholder={placeholder}
    />
  );
};
