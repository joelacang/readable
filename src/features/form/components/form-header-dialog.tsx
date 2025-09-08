interface Props {
  title: string;
}
const FormHeaderDialog = ({ title }: Props) => {
  return (
    <h4 className="border-primary text-primary border-b pb-2 text-sm font-semibold">
      {title}
    </h4>
  );
};

export default FormHeaderDialog;
