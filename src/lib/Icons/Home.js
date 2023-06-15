// https://fonts.google.com/icons?selected=Material+Symbols+Outlined:home:FILL@1;wght@700;GRAD@0;opsz@40&icon.set=Material+Symbols&icon.query=HOME

import styles from './Home.module.scss';

export default function HomeIcon() {
    return (
        <div className={styles.homeIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M132-92v-522.111l348-261.555 348.667 261.222V-92h-262v-314.667H393.333V-92H132Z"/></svg>
        </div>
    )
}
