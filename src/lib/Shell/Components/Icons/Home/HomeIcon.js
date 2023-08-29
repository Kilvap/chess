// https://fonts.google.com/icons?selected=Material+Symbols+Outlined:home:FILL@1;wght@700;GRAD@0;opsz@24&icon.set=Material+Symbols&icon.query=HOME
import styles from './HomeIcon.module.scss';

export default function HomeIcon(props) {
    return (
        <a className={props.className} href={props.link} aria-label="Home">
            <div className={styles.homeIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M126-86v-531l354-266 354 265.667V-86H568v-322H392v322H126Z"/></svg>
            </div>
        </a>
    )
}
