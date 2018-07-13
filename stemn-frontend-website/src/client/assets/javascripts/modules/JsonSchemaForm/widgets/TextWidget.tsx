import * as React from 'react';
import Input from 'stemn-shared/misc/Input/Input/Input'
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';

export const TextWidget = (props: WidgetProps & FieldTemplateProps) => {
  return (
    <Input
      required={props.required}
      value={props.value}
      className="dr-input flex"
      type="text"
      onChange={(event : React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
    />
  );
};