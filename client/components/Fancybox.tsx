import React, { useEffect } from "react";
// @ts-ignore
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";

function Fancybox(props: any) {
    const delegate = props.delegate || "[data-fancybox]";

    useEffect(() => {
        const opts = props.options || {};

        NativeFancybox.bind(delegate, opts);

        return () => {
            NativeFancybox.destroy();
        };
    }, [delegate, props.options]);

    return <>{props.children}</>;
}

export default Fancybox;
