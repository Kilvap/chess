import GithubIcon from '../Icons/Github/GithubIcon';
import HomeIcon from '../Icons/Home/HomeIcon';
import InfoIcon from '../Icons/Info/InfoIcon';

import styles from './Nav.module.scss';

export default function Nav(props) {
    return (
        <div className={styles.nav}>
            <div className={styles.navIsland}>
                <div className={styles.navButton}>
                    <HomeIcon link={props.links["home"]} />
                </div>

                <div className={styles.navButton}>
                    <InfoIcon link={props.links["info"]} />
                </div>

                <div className={styles.navButton}>
                    <GithubIcon link={props.links["github"]} />
                </div>
            </div>
        </div>
    )
}
