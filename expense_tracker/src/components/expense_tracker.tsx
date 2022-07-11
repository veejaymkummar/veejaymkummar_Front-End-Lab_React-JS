import { useState, useEffect, useRef, FormEvent } from "react";
import { getItems, addExpenseItem } from "../services/item";
import { Spinner, Alert, Container, Table, Button, Modal, Form } from 'react-bootstrap';
import IItem from "../models/iItems";


const ExpenseTracker = () => {
    const [items, setItems] = useState<IItem[]>([] as IItem[]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [show, setShow] = useState(false);
    const payeeNameRef = useRef<HTMLSelectElement>(null);
    const productRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const items = await getItems();
                setItems(items);
            }
            catch (error) {
                setError(error as Error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchItems()
    }, []);

    const totalByPayee = (name: String) => {
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            if (items[i].payeeName === name) { total = total + items[i].price; }
        }
        return total
    }

    const whowillpay = (RahulTotal: number, RameshTotal: number) => {
        let returnAmount = 0;
        if (RahulTotal > RameshTotal) {
            returnAmount = (RahulTotal - RameshTotal) / 2;
            return (`Ramesh has to pay Rahul an amount of : ${returnAmount}`);
        }
        else {
            returnAmount = Math.abs((RahulTotal - RameshTotal) / 2);
            return (`Rahul has to pay Ramesh an amount of : ${returnAmount}`);
        }
    }

    const addExpense = async (event: FormEvent) => {
        event.preventDefault();
        const expense = {
            payeeName: payeeNameRef?.current?.value,
            product: productRef?.current?.value as string,
            price: parseFloat(priceRef?.current?.value as string) as number,
            setDate: dateRef?.current?.value as string
        } as Omit<IItem, 'id'>;
        const ExpenseItem = await addExpenseItem(expense);

        setItems([
            ...items,
            ExpenseItem
        ]);

        handleClose();
    }

    return (<Container className="my-4">
        <h1>Expense Tracker
            <Button variant="primary" className="float-end" onClick={handleShow}>Add Expense</Button></h1>
        <Modal show={show} onHide={handleClose}>
            <Form>
                <Modal.Header closeButton>
                    <Modal.Title>Add Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="payeeName">
                        <Form.Label>Who has Paid?</Form.Label>
                        <Form.Select aria-label="Payee Name" ref={payeeNameRef}>
                            <option>--Select Payee--</option>
                            <option>Rahul</option>
                            <option>Ramesh</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="product">
                        <Form.Label>Paid for what?</Form.Label>
                        <Form.Control type="text" placeholder="Paid for what?" ref={productRef} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="number" placeholder="Amount" min="0" ref={priceRef} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="date">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" placeholder="Select Date" min="0" ref={dateRef} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addExpense}>
                        Add Expense
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
        <hr />
        {
            loading && (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )
        }
        {
            !loading && error && (
                <Alert variant="danger">{error.message}</Alert>
            )
        }
        {
            !loading && !error && (
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Payee Name</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th className="text-end">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            items.map(
                                (item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.payeeName}</td>
                                        <td>{item.product}</td>
                                        <td>{item.setDate}</td>
                                        <td className="text-end">{item.price}</td>
                                    </tr>
                                ))
                        }
                        <tr>
                            <td colSpan={4} className="text-end">Rahul Paid</td>
                            <td className="text-end">{totalByPayee('Rahul')}</td>
                        </tr>

                        <tr>
                            <td colSpan={4} className="text-end">Ramesh Paid</td>
                            <td className="text-end">{totalByPayee('Ramesh')}</td>
                        </tr>
                        <tr>
                            <td colSpan={5} className="text-end">{whowillpay(totalByPayee('Rahul'), totalByPayee('Ramesh'))}</td>
                        </tr>
                    </tbody>
                </Table>)
        }
    </Container >
    );
};

export default ExpenseTracker;