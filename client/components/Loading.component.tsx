import React from 'react';
import styles from "../styles/Loading.module.scss";

type Props = {
    dark?: boolean
}

const LoadingComponent: React.FC<Props> = ({dark}) => {
    return <div>
        {!dark ? <section className={styles.wrapper}>
            <div className={styles.spinner}>
                <i/>
                <i/>
                <i/>
                <i/>
                <i/>
                <i/>
                <i/>
            </div>
        </section> : <section className={`${styles.wrapper} ${styles.dark}`}>
            <div className={styles.spinner}>
                <i/>
                <i/>
                <i/>
                <i/>
                <i/>
                <i/>
                <i/>
            </div>
        </section>}
    </div>
}
export default LoadingComponent;