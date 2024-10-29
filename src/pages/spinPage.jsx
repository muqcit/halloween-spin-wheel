import SpinWheel from "../components/spinWheel"
import style from "./spinPage.module.css"


const SpinPage = () => {
    return (
        <div className={style.container}>
            <div className={`${style.background} ${style.lightning}`}></div>
            <div className={style.spinWheelContainer}>
                <SpinWheel />
            </div>
        </div>
    )
}

export default SpinPage