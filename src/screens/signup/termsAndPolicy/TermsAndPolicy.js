import React from 'react';
import ButtonGroup from '../../../components/ButtonGroup';

const TermsAndPolicy = ({ title, subheading_one, subheading_two, details_one, details_two, subheading_three, details_three, btnOneName, btnTwoName }) => {
    console.log(title)
    return (
        <div>
            <h1 className="font-bold text-4xl mb-8">{title}</h1>
            <div className="bg-neutral-100 p-9 w-[35rem] ">
                <h5 className="font-bold mb-2">{subheading_one}</h5>
                <p className="text-justify">{details_one}</p>
                <h5 className="font-bold mb-2 mt-4">{subheading_two}</h5>
                <p className="text-justify">{details_two}</p>
                <h5 className="font-bold mb-2 mt-4">{subheading_three}</h5>
                <p className="text-justify">{details_three}</p>
                <ButtonGroup btnOneName={btnOneName} btnTwoName={btnTwoName} />

            </div>
        </div>
    );
};

export default TermsAndPolicy;