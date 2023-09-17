import {__} from "@wordpress/i18n";
import {NotFound, PermissionDenied} from "../Components/404";
import {Button} from "../Components/Button";
import {Card} from "../Components/Card";
import {CloseButton} from "../Components/CloseButton";
import {EmptyState} from "../Components/EmptyState";
import {FormInput} from "../Components/FormInput";
import {FormCheckBox} from "../Components/FormCheckBox";
import {Loading} from "../Components/Loading";
import {Modal} from "../Components/Modal";
import {useState} from "@wordpress/element";
import {SelectBox, SelectBoxType} from "../Components/SelectBox";
import {Spinner} from "../Components/Spinner";
import {filtersType, Table} from "../Components/Table";
import {Textarea} from "../Components/Textarea";

export const AllComponents = () => {
    const [modal, setModal] = useState(false);
    const [country, setCountry] = useState([
        {id: 1, name: 'Afghanistan'},
        {id: 2, name: 'Albania'},
        {id: 3, name: 'Algeria'},
        {id: 4, name: 'Andorra'},
        {id: 5, name: 'Angola'},
    ] as SelectBoxType[]);
    const tableData = [
        {id: 1, name: 'Jhon Doe', email: 'jhon@doe.com', phone: '1234567890'},
        {id: 2, name: 'Jhon Doe', email: 'jhon@doe.com', phone: '1234567890'},
        {id: 3, name: 'Jhon Doe', email: 'jhon@doe.com', phone: '1234567890'},
        {id: 4, name: 'Jhon Doe', email: 'jhon@doe.com', phone: '1234567890'},
        {id: 5, name: 'Jhon Doe', email: 'jhon@doe.com', phone: '1234567890'},
        {id: 6, name: 'Jhon Doe', email: 'jhon@doe.com', phone: '1234567890'},
        {id: 7, name: 'Jhon Doe', email: 'jhon@doe.com', phone: '1234567890'},
    ]
    const columns = [
        {dataIndex: 'id', title: __('ID', 'plugin-name'), sortable: true},
        {dataIndex: 'name', title: __('Name', 'plugin-name'), sortable: true},
        {dataIndex: 'email', title: __('Email', 'plugin-name'), sortable: true},
        {dataIndex: 'phone', title: __('Phone', 'plugin-name'), sortable: true},
        {
            dataIndex: 'action', title: __('Action', 'plugin-name'), sortable: false,
            render: (row: any) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={()=> alert('Edit Button clicked')}>
                            {__('Edit', 'plugin-name')}
                        </Button>
                    </div>
                )
            }
        }
    ]
    const filter: filtersType = {
        per_page: 10,
        page: 1,
        search: '',
        order_by: 'name',
        order: 'asc',
    }
    return (
        <div>
            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6 mt-6">
                {__('Not Found', 'plugin-name')}
            </h1>
            <NotFound />

            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6 mt-6">
                {__('Permission Denied', 'plugin-name')}
            </h1>
            <PermissionDenied />

            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6 mt-6">
                {__('Button', 'plugin-name')}
            </h1>
            <Button onClick={()=> alert('Button clicked')}>
                {__('Button', 'plugin-name')}
            </Button>

            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6 mt-6">
                {__('Link', 'plugin-name')}
            </h1>
            <Button path={'/'}>
                {__('Link', 'plugin-name')}
            </Button>

            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6 mt-6">
                {__('Card', 'plugin-name')}
            </h1>
            <Card>
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-medium leading-6 text-gray-900 truncate">
                            {__('Card', 'plugin-name')}
                        </h2>
                    </div>
                </div>
            </Card>

            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6 mt-6">
                {__('Close Button', 'plugin-name')}
            </h1>
            <CloseButton onClick={()=> alert('Close Button clicked')}/>

            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6 mt-6">
                {__('Empty State', 'plugin-name')}
            </h1>
            <EmptyState />

            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6 mt-6">
                {__('Form', 'plugin-name')}
            </h1>
            <Card>
                <FormInput tooltip={'Please enter your name'} name={'name'} id={'name'} value={'name'} onChange={(e)=> console.log(e.target.value)}/>
                <FormInput type={'password'} name={'password'} id={'password'} value={'password'} onChange={(e)=> console.log(e.target.value)}/>
                <FormCheckBox label={'Gender'} name={'gender'} id={'gender'} value={'Male'} checked={true} onChange={(e)=> console.log(e.target.value)}/>
                <SelectBox title={'Country'} options={country} selected={country[0]} setSelected={()=>setCountry}/>
                <Textarea label={'Address'} name={'address'} id={'address'} value={'address'} onChange={(e)=> console.log(e.target.value)}/>
            </Card>
            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6 mt-6">
                {__('Loading', 'plugin-name')}
            </h1>
            <Loading />

            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6 mt-6">
                {__('Modal', 'plugin-name')}
            </h1>
            <Button onClick={()=> setModal(true)}>
                {__('Open Modal', 'plugin-name')}
            </Button>
            {modal && (
                <Modal header={__('Modal', 'plugin-name')} setShowModal={setModal}>
                    <p className="text-sm text-gray-500">
                        {__('Modal Content', 'plugin-name')}
                    </p>
                </Modal>
            )}

            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6 mt-6">
                {__('Spinner', 'plugin-name')}
            </h1>
            <Spinner />

            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6 mt-6">
                {__('Table', 'plugin-name')}
            </h1>
            <Table columns={columns} data={tableData} total={tableData.length} filters={filter} />
        </div>
    );
}
