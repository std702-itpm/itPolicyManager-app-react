import React, {Component} from "react";
import styles from "./LoaderSpinner.module.css";

/**
 * This component is used to cover a page, modal
 * or another element during some processing,
 * for example, while requesting data from backend.
 */
class LoaderSpinner extends Component {
    render() {
        return (
            <div className={styles.loaderWrapper}>
                <div className={[styles.spinner, "spinner-border"].join(" ")}>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }
}

export default LoaderSpinner;
