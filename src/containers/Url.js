import React from "react";
import { Auth, API } from "aws-amplify";
import {
  Button,
  ListGroup,
  ListGroupItem,
  FormGroup,
  FormControl,
  InputGroup,
  Table,
  Modal,
} from "react-bootstrap";
import "./Url.css";
import Pagination from '../components/Pagination.js';

class Url extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      given_name: "",
      family_name: "",
      words: [],
      articles: [],
      article_modal: false,
      summary_modal: false,
      article: "",
      summary: "",
      currentPage: 1,
      postsPerPage: 10
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUrl = this.handleUrl.bind(this);
    this.handleSummarize = this.handleSummarize.bind(this);
    this.handleArticle = this.handleArticle.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.toggleArticle = this.toggleArticle.bind(this);
    this.setArticle = this.setArticle.bind(this);
    this.toggleSummary = this.toggleSummary.bind(this);
    this.setSummary = this.setSummary.bind(this);
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser().then(user => {
      const { attributes } = user;
      console.log(attributes.sub);
      this.setState({
        email: attributes.email,
        given_name: attributes.given_name,
        family_name: attributes.family_name
      });
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const val = this.myInput.value;
    if (val.length > 0 && /^[a-zA-Z]+$/.test(val)) {
      this.setState(prevState => ({
        words: [...prevState.words, val]
      }));
    } else {
      alert("Must Enter Single Word Only");
    }
    this.myInput.value = "";
  };

  handleUrl = event => {
    event.preventDefault();
    console.log(this.state.words);
    if (this.state.words.length === 0) {
      alert("Enter Keywords");
      return;
    }
    let apiName = "url-api";
    let path = "/url";
    let myInit = {
      body: { keywords: this.state.words }, // replace this with attributes you need
      headers: {} // OPTIONAL
    };
    API.post(apiName, path, myInit)
      .then(response => {
        console.log(response);
        this.setState({ articles: response }, () => {
          if (!this.state.articles || this.state.articles.length === 0) {
            alert('There were no articles found containing those keywords.')
          }
        });
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  handleSummarize = (event, article_id) => {
    event.preventDefault();
    console.log(article_id);
    let apiName = "summarize-api";
    let path = "/summarize";
    let myInit = {
      body: { id: article_id }, // replace this with attributes you need
      headers: {} // OPTIONAL
    };
    API.post(apiName, path, myInit)
      .then(response => {
        console.log(response);
        this.toggleSummary();
        this.setSummary(response);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  handleArticle = (event, article_id) => {
    event.preventDefault();
    console.log(article_id);
    let apiName = "article-api";
    let path = "/article";
    let myInit = {
      body: { id: article_id }, // replace this with attributes you need
      headers: {} // OPTIONAL
    };
    API.post(apiName, path, myInit)
      .then(response => {
        console.log(response);
        this.toggleArticle();
        this.setArticle(response);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  handleClear = event => {
    event.preventDefault();
    this.setState({ words: [] });
  };

  paginate = pageNumber => this.setState({currentPage: pageNumber});

  toggleArticle = () => {
    this.setState({ article_modal: !this.state.article_modal });
  }

  toggleSummary = () => {
    this.setState({ summary_modal: !this.state.summary_modal });
  }

  setArticle = new_article => {
    this.setState({ article: new_article })
  }

  setSummary = new_summary => {
    this.setState({ summary: new_summary })
  }

  render() {
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    let articles = this.state.articles;
    if (this.state.articles === null) {
      articles = [];
    }
    let currentPosts = articles.slice(indexOfFirstPost, indexOfLastPost);
    return (
      <div className="url-container">
        <form onSubmit={e => this.handleSubmit(e)} className="url-search">
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                inputRef={ref => {
                  this.myInput = ref;
                }}
                placeholder="Enter Keywords"
              />
              <InputGroup.Addon>
                <i className="fas fa-plus-circle fa-2x"></i>
              </InputGroup.Addon>            
            </InputGroup>
          </FormGroup>
        </form>
        <ListGroup>
          {this.state.words.map((word, i) => (
            <div className="url-word-list-item">
              <ListGroupItem key={i}>{word}</ListGroupItem>
            </div>
          ))}
        </ListGroup>
        <div className="url-buttons">
          <Button onClick={e => this.handleUrl(e)}>Search</Button>{" "}
          <Button onClick={e => this.handleClear(e)}>Clear</Button>
        </div>
        <br />
        <br />
        {this.state.articles && this.state.articles.length > 0 ? (
          <div>
            <div className="url-table">
            <Table bordered hover>
              <thead>
                <tr className="url-table-top">
                  <th>Title</th>
                  <th>Author</th>
                  <th>Description</th>
                  <th>Link</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {currentPosts.map((url, i) => (
                <tr key={i}>
                  <td>{url[1]}</td>
                  <td>{url[2]}</td>
                  <td>{url[3]}</td>
                  <td><a href={url[4]} target="_blank" rel="noopener noreferrer">{url[4]}</a></td>
                  <td>{url[6]}</td>
                  <td>{url[5]}</td>
                  <td>{
                    <button onClick={e => this.handleSummarize(e, url[0])} className="summary-btn">
                      Summary
                    </button>
                  }</td>
                  <td>{
                    <button onClick={e => this.handleArticle(e, url[0])} className="article-btn">
                      Article
                    </button>
                  }</td>
                </tr>
              ))}
                </tbody>
              </Table>
            </div>
          </div>
          )
        : 
          null
        }
        <Pagination
          postsPerPage={this.state.postsPerPage}
          totalPosts={articles.length}
          paginate={this.paginate}
        />  

        {/* Article Popup */}
        <Modal show={this.state.article_modal} onHide={this.toggleArticle}>
          <Modal.Title>Full Article</Modal.Title>
          <Modal.Body>
            {this.state.article}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.toggleArticle}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/* Summary Popup */}
        <Modal show={this.state.summary_modal} onHide={this.toggleSummary}>
          <Modal.Title>Summary</Modal.Title>
          <Modal.Body>
            {this.state.summary}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.toggleSummary}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
export default Url;