import styles from './Shell.module.scss';
import Nav from './Components/Nav/Nav';

function Shell(props) {
    return (
        <div className={styles.container}>
            <div className={styles.mainArea}>
                { props.children }
            </div>
            <Nav links={props.navLinks} />
        </div>
    )
}

export default Shell;
