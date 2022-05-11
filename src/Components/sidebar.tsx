import * as React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import { FormatAlignRight, CheckCircle, AddCircle, SearchRounded, Cancel } from '@mui/icons-material';
import '../assest/app.scss';
import { Avatar } from '@mui/material';
import { contacts } from '../Utils/API';
import useDebounce from '../Utils/Functions/useDebounce'

interface contact {
    name: string;
    phoneNumber: string;
    tags: tag[]
}

interface tag {
    name: string
}

const tagList = [
    "incididunt",
    "nulla",
    "reprehenderit",
    "sint",
    "ullamco",
    "magna",
]

export default function Sidebar() {
    const [searchValue, setsearchValue] = React.useState('')

    // Api responce
    const [contactList, setcontactList] = React.useState([])
    const [total, settotal] = React.useState(0)
    const [tagsInclude, settagsInclude] = React.useState<string[]>([])
    const [tagsExclude, settagsExclude] = React.useState<string[]>([])
    const [messagesFilter, setmessagesFilter] = React.useState({
        messageSentMin: 0,
        messageSentMax: 0,
        messageRecievedMin: 0,
        messageRecievedMax: 0,
    })


    const debouncedSearchTerm = useDebounce(searchValue, 500);

    // manage drawer for responsive view
    const [isOpen, setisOpen] = React.useState(false)

    React.useEffect(() => {
        getData()
    }, [debouncedSearchTerm])

    const getData = async () => {
        let query = `q=${searchValue}${tagsInclude?.map((item) => `&tags=${item}`)}
                        ${tagsExclude?.map((item) => `&notTags=${item}`)}`

        if(messagesFilter?.messageSentMin){
            query = query.concat(`&minMessagesSent=${messagesFilter?.messageSentMin}`)
        }   
        
        if(messagesFilter?.messageSentMax){
            query = query.concat(`&maxMessagesSent=${messagesFilter?.messageSentMax}`)
        }  
        
        if(messagesFilter?.messageRecievedMin){
            query = query.concat(`&minMessagesRecv=${messagesFilter?.messageRecievedMin}`)
        } 
        
        if(messagesFilter?.messageRecievedMax){
            query = query.concat(`&maxMessagesRecv=${messagesFilter?.messageRecievedMax}`)
        } 

        const result = await contacts(query)

        setcontactList(result?.data?.contacts)
        settotal(result?.data?.totalCount)
    }

    const filterTagsInclude = (tagName: string) => {
        const tags = JSON.parse(JSON.stringify(tagsInclude))
        if (!tagsInclude?.includes(tagName)) {
            tags.push(tagName)
            settagsInclude(tags)
            return
        }

        settagsInclude(tagsInclude?.filter((tag: string) => tag !== tagName))
    }

    console.info("tagsIncludes++ ", tagsInclude)

    const filterTagsExclude = (tagName: string) => {
        const tags = JSON.parse(JSON.stringify(tagsExclude))
        if (!tagsExclude?.includes(tagName)) {
            tags.push(tagName)
            settagsExclude(tags)
            return
        }

        settagsExclude(tagsExclude?.filter((tag: string) => tag !== tagName))
    }

    const filterMessages = (value: string, name: string) => {
        setmessagesFilter({ ...messagesFilter, [name]: [value] })
    }


    return (
        <Box>
            <Grid container>
                <Grid className='leftpenal' item xs={2} md={12}>
                    <Box className='audience-left'>
                        <Box className='audience-main-title'>
                            <Box onClick={() => setisOpen(!isOpen)}><FormatAlignRight /></Box>
                            <Typography className='Audience-title'>Audience</Typography>
                            <Box><Typography className='Audience-contacts'>{total} contacts</Typography></Box>
                        </Box>
                        <Box className={`tags-section ${isOpen && 'active'}`}>
                            <Box className='includetag-section'>
                                <Box className='includetag-left'>
                                    <Typography className='tags-title'>include tags:</Typography>
                                    <ul className='tags-ul'>
                                        {
                                            tagList?.map((item) => {
                                                return (
                                                    <li onClick={() => filterTagsInclude(item)} className='tags-checked'>{item} {tagsInclude?.includes(item) && <CheckCircle />} </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </Box>
                                <Box className='includetag-left'>
                                    <Typography className='tags-title'>Exclude tags:</Typography>
                                    <ul className='tags-ul'>
                                        {
                                            tagList?.map((item) => {
                                                return (
                                                    <li onClick={() => filterTagsExclude(item)} className='tags-checked'>{item} {tagsExclude?.includes(item) && <CheckCircle />} </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </Box>
                                <Box className='includetag-left'>
                                    <Typography className='tags-title'>Message sent:</Typography>
                                    <Box className='message-box'>
                                        <Box className='message-min'>
                                            <TextField
                                                hiddenLabel
                                                id="filled-hidden-label-normal"
                                                placeholder="Min"
                                                variant="filled"
                                                name='messageSentMin'
                                                value={messagesFilter?.messageSentMin}
                                                onChange={(e) => filterMessages(e.target.value, e.target.name)}
                                            />
                                        </Box>
                                        <Box className='message-max'>
                                            <TextField
                                                hiddenLabel
                                                id="filled-hidden-label-normal"
                                                placeholder="max"
                                                variant="filled"
                                                name='messageSentMax'
                                                value={messagesFilter?.messageSentMax}
                                                onChange={(e) => filterMessages(e.target.value, e.target.name)}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className='includetag-left'>
                                    <Typography className='tags-title'>Message Received:</Typography>
                                    <Box className='message-box'>
                                        <Box className='message-min'>
                                            <TextField
                                                hiddenLabel
                                                id="filled-hidden-label-normal"
                                                placeholder="Min"
                                                variant="filled"
                                                name='messageRecievedMin'
                                                value={messagesFilter?.messageRecievedMin}
                                                onChange={(e) => filterMessages(e.target.value, e.target.name)}
                                            />
                                        </Box>
                                        <Box className='message-max'>
                                            <TextField
                                                hiddenLabel
                                                id="filled-hidden-label-normal"
                                                placeholder="max"
                                                variant="filled"
                                                name='messageRecievedMax'
                                                value={messagesFilter?.messageRecievedMax}
                                                onChange={(e) => filterMessages(e.target.value, e.target.name)}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className='includetag-button'>
                                <Button onClick={getData} className='savefilters' variant="contained" color="success">
                                    Save Filters
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Box className='Contacts-right'>
                        <Box className='Contacts-heading'>
                            <Typography className='Contacts-title'>All Contacts ({total})</Typography>
                            <AddCircle />
                        </Box>
                        <Box className='Serch-input'>
                            <Box className='Serch-input-inner'>
                                <SearchRounded />
                                <TextField
                                    hiddenLabel
                                    id="filled-hidden-label-normal"
                                    placeholder="Search contacts"
                                    variant="filled"
                                    value={searchValue}
                                    onChange={(e) => setsearchValue(e?.target?.value)}
                                />
                            </Box>
                        </Box>
                        <Box className='Select-heading'>
                            <Typography className='Select-title'> <CheckCircle />Select All</Typography>
                            <Button className='Export-btn ' variant="contained" color="success">
                                Export All
                            </Button>
                        </Box>
                        <Box className='category-block'>
                            {contactList?.map((item: contact) => {
                                console.info("item++ ", item)
                                return (
                                    <Box className='category-item'>
                                        <Box className='category-inner'>
                                            <ul>
                                                <li>
                                                    <Box className='category-name-left'>
                                                        <CheckCircle />
                                                        <Box className='category-profile'>
                                                            <Box className='category-profile-img'>
                                                                <Avatar alt={item?.name}>{item?.name?.charAt(0)}</Avatar>
                                                            </Box>
                                                            <Box className='category-profile-content'>
                                                                <Typography className='category-profile-title'>{item?.name}</Typography>
                                                                <Typography className='category-profile-number'>+{item?.phoneNumber}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                    <Box className='category-tag-right'>
                                                        <Box className='category-tag-add'>
                                                            <Box className='category-tag-item'>
                                                                {item?.tags && item?.tags?.map((tag) => {
                                                                    return (<Box className='category-tag-addbutton'>
                                                                        <Button className='addbutton' variant="contained" color="success">
                                                                            {tag?.name}
                                                                            <Cancel />
                                                                        </Button>
                                                                    </Box>)
                                                                })}
                                                            </Box>
                                                            <Box className='addCircle-icon'>
                                                                <AddCircle />
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </li>
                                            </ul>
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
