import { Fragment, useState } from '@wordpress/element';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { SelectBoxType } from '../Types/SalaryHeadType';
import {__} from "@wordpress/i18n";

// @ts-ignore
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

interface SelectBoxProps extends React.InputHTMLAttributes<HTMLDivElement> {
    title: string;
    options: SelectBoxType[];
    selected: SelectBoxType;
    setSelected: (selected: SelectBoxType) => void;
    required?: boolean;
    error?: any;
}

export const SelectBox = ({title, options, selected, setSelected, error, required= false, className, ...props}: SelectBoxProps) => {
    return (
        <div>
            <div className={`relative mt-1 rounded-md ${className || ''}`}>
                <Listbox value={selected} onChange={setSelected}>
                    {({ open }) => (
                        <>
                            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                                {title}
                                {required && <span className="text-red-500">*</span>}
                            </Listbox.Label>
                            <div className="relative mt-2">
                                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    <span className="block truncate">{selected.name || __('Select one', 'pcm-pro')}</span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </span>
                                </Listbox.Button>

                                <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute z-[100] mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {options.map((item) => (
                                            <Listbox.Option
                                                key={item.id}
                                                className={({ active }) =>
                                                    classNames(
                                                        active
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'text-gray-900',
                                                        'relative cursor-default select-none py-2 pl-8 pr-4'
                                                    )
                                                }
                                                value={item}
                                            >
                                                {({ selected, active }) => (
                                                    <>
                                                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                            {item.name}
                                                        </span>
                                                        {selected ? (
                                                            <span
                                                                className={classNames(
                                                                    active ? 'text-white' : 'text-indigo-600',
                                                                    'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                                                )}
                                                            >
                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                            {error && (
                                <p className="mt-2 text-sm text-red-600" id={'error'+selected}>
                                    {error}
                                </p>
                            )}
                        </>
                    )}
                </Listbox>
            </div>
        </div>
    );
};

// @ts-ignore
window.SelectBox = SelectBox;
