import React from 'react';

const InputSegment = React.createClass({
    propTypes: {
        placeholder: React.PropTypes.string,
        maxLength: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        onChangeAction: React.PropTypes.func.isRequired,
        forceBlur: React.PropTypes.func,
        isFocused: React.PropTypes.bool,
        setParentFocus: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            __internalValue: '',
            __displayValue: this.props.value
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.isFocused) {
            window.requestAnimationFrame(this.selectAll)
        }
    },
    render: function () {
        const {
            maxLength,
            name
        } = this.props

        const {
            __internalValue,
            __displayValue
        } = this.state

        const classNames = [
            this.props.className || '',
            'date-input__chunk'
        ]

        if (__displayValue == null) {
            classNames.push('date-input__chunk--placeholder')
        }

        return (
            <div>
                <input
                    className={ classNames.join(' ') }
                    maxlength={ maxLength }
                    name={ name }
                    onFocus={ this.onFocus }
                    onKeyPress={ this.onKeyPress }
                    onKeyDown={ this.onKeyDown }
                    onBlur={ this.onBlur }
                    ref={ inputEl => { this.inputEl = inputEl } }
                    value={ this.padInput() }
                />
            </div>
        )
    },
    padInput: function () {
        const {
            __internalValue,
            __displayValue
        } = this.state

        return __internalValue != null && __displayValue != null ?
            ('0000' + this.getSafeValue())
                .substr(this.props.maxLength * -1) :
            this.props.placeholder
    },
    getSafeValue: function () {
        const {
            __internalValue,
            __displayValue
        } = this.state

        return __displayValue != null ?
            __displayValue :
            __internalValue
    },
    selectAll: function () {
        if (document.activeElement !== this.inputEl) {
            this.inputEl.focus()
        }
        this.inputEl.selectionStart = 0
        this.inputEl.selectionEnd = this.props.maxLength
    },
    onKeyDown: function (e) {
        if (e.keyCode === 8) {
            this.setState({
                __internalValue: null,
                __displayValue: null
            })
            this.selectAll()
        }
    },
    onKeyPress: function (e) {
        const nextVal = ((this.state.__internalValue || '') + e.key)
            .substr(this.props.maxLength * -1)

        if ((/\d/).test(e.key)) {
            this.setState({
                __internalValue: nextVal,
                __displayValue: nextVal
            })
        }

        if (nextVal.length === this.props.maxLength && this.props.forceBlur) {
            this.props.forceBlur()
        } else {
            window.requestAnimationFrame(this.selectAll)
        }

        this.props.onChangeAction(nextVal)
    },
    onFocus: function () {
        this.selectAll()
        this.props.setParentFocus(true)
    },
    onBlur: function () {
        this.props.onChangeAction(this.state.__displayValue)
        this.setState({
            __internalValue: ''
        })
        this.props.setParentFocus(false)
    }
})

const uniqueKey = Math.floor(Math.random() * 100000)
const ID_MONTH = `date-input-month-${uniqueKey}`
const ID_DAY = `date-input-day-${uniqueKey}`
const ID_YEAR = `date-input-year-${uniqueKey}`

const Input = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        onChangeAction: React.PropTypes.func.isRequired,
        value: React.PropTypes.string
    },
    getInitialState: function() {
        return {
            activeInputId: null,
            isFocused: false,
            [ID_MONTH]: null,
            [ID_DAY]: null,
            [ID_YEAR]: null
        }
    },
    render() {
        const { name } = this.props

        const {
            activeInputId,
            isFocused
        } = this.state

        const classNames = [
            'date-input',
            isFocused ? 'date-input--focus' : ''
        ].join(' ')

        return (
            <div className={ classNames } onClick={ this.focusFirst }>
                <InputSegment
                    placeholder="mm"
                    maxLength={ 2 }
                    value={ null }
                    name={ name + ID_MONTH }
                    onChangeAction={ this.onChunkChange(ID_MONTH) }
                    forceBlur={ this.setFocus(ID_DAY) }
                    isFocused={ activeInputId === ID_MONTH }
                    className='date-input__chunk--month'
                    setParentFocus={ this.setFocusState }
                />
                <span className="date-input__separator">/</span>
                <InputSegment
                    placeholder="dd"
                    maxLength={ 2 }
                    value={ null }
                    name={ name + ID_DAY }
                    onChangeAction={ this.onChunkChange(ID_DAY) }
                    forceBlur={ this.setFocus(ID_YEAR) }
                    isFocused={ activeInputId === ID_DAY }
                    className='date-input__chunk--day'
                    setParentFocus={ this.setFocusState }
                />
                <span className="date-input__separator">/</span>
                <InputSegment
                    placeholder="yyyy"
                    maxLength={ 4 }
                    value={ null }
                    name={ name + ID_YEAR }
                    onChangeAction={ this.onChunkChange(ID_YEAR) }
                    isFocused={ activeInputId === ID_YEAR }
                    className='date-input__chunk--year'
                    setParentFocus={ this.setFocusState }
                />
            </div>
        )
    },
    onChunkChange(valueMatch) {
        return val => {
            this.setState({
                [valueMatch]: val
            })

            window.requestAnimationFrame(() => {
                const month = this.state[ID_MONTH]
                const day = this.state[ID_DAY]
                const year = this.state[ID_YEAR]

                console.log('chunk change', valueMatch, val, month, day, year)

                if (month && day && year) {
                    this.props.onChangeAction(year + '-' + month + '-' + day)
                }
            })
        }
    },
    setFocusState: function (isFocused) {
        this.setState({
            isFocused: isFocused
        })
    },
    setFocus(id) {
        return () => {
            this.setState({
                activeInputId: id
            })
            window.requestAnimationFrame(() => {
                this.setState({
                    activeInputId: null
                })
            })
        }
    },
    focusFirst() {
        if (!this.state.isFocused) {
            this.setFocus(ID_MONTH)()
        }
    }
})

const App = React.createClass({
    render: function () {
        return (
            <div className="app">
                <Input
                    name="birthday"
                    onChangeAction={ this.logChangedValue }
                />
            </div>
        )
    },
    logChangedValue: function (val) {
        console.log('update state with: ', val)
    }
})

ReactDOM.render(
    <App />,
    document.getElementById('app')
)

document.querySelectorAll('input[type="date"]')[0].addEventListener('change', function () {
    console.log('change')
})