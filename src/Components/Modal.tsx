import {Fragment} from '@wordpress/element'
import {Dialog, Transition} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'

type ModalProps = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    header?: React.ReactNode;
    children?: React.ReactNode;
    description?: React.ReactNode;
    width?: string;
    zIndex?: string;
};

export const Modal = ({setShowModal, children, header, description = '', width = 'sm:w-full sm:max-w-lg', ...props}: ModalProps) => {
    props.zIndex = props.zIndex ? props.zIndex : ' z-auto'
    return (
        <>
            <Transition.Root show={true} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-auto"
                    onClose={setShowModal}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className={"fixed inset-0 overflow-y-auto " + props.zIndex}>
                        <div className="flex mt-2 items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className={"relative transform overflow-hidden bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-16 sm:p-6 " + width}>
                                    <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                    <div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-6 text-gray-900"
                                            >
                                                {header}
                                            </Dialog.Title>
                                            <Dialog.Description>
                                                {description}
                                            </Dialog.Description>
                                            <div className="mt-2">
                                                {children}
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
};

// @ts-ignore
window.Modal = Modal;
