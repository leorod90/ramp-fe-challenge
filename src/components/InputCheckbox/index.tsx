import classNames from "classnames"
import { useRef } from "react"
import { InputCheckboxComponent } from "./types"

interface Props {
  id: string | number
  checked?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }: Props) => {
  const { current: inputId } = useRef(`RampInputCheckbox-${id}`)

  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      {/* <label
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": checked,
          "RampInputCheckbox--label-disabled": disabled,
        })}
      /> */}
      <input
        id={inputId}
        type="checkbox"
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": checked,
          "RampInputCheckbox--label-disabled": disabled,
        })}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(!checked)}
      />
    </div>
  )
}
