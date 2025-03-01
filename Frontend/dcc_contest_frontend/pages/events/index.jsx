import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { BASE_URL } from "../../utils/constants";
import AlertError from "../problemset/AlertError";
import ProblemTable from "../../components/ProblemStructure/ProblemView";
import PageButtons from "../problemset/PageButtons";
import ProblemSetSkeleton from "./ProblemSetSkeleton";
import Progress from "../../components/progressBar/Progress";
import Navbar from "../../components/Navbar";
import TheFooter from "../../components/Footer";
import LeaderBoard from "../../components/ProblemStructure/LeaderBoard";
import HotTopics from "../../components/ProblemStructure/HotTopics";
import { useSelector } from "react-redux";
import { codeforcesName, progressBar } from "../../utils/helper/apiIntegration";
function ProblemSet() {
  const [problems, setProblems] = React.useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [severeError, setSevereError] = useState(""); // Error in case backend is not able to give proper response
  const [tabActive, setTabActive] = useState("Problem");
  const [points, setPoints] = useState(0);
  const [url1, setUrl1] = useState("");
  const loginState = useSelector((state) => state.login);
  const [binaryStringProblem, setBinaryStringProblem] = useState("");
  const [binaryStringTopic, setBinaryStringTopic] = useState('0'.repeat(22));
  useEffect(() => {
    async function fetchQuestions() {
      const url = `${BASE_URL}/21days/getQuestion`;
      try {
        const res = await fetch(url);
        const data = await res.json();

        setProblems(data.questions);
      } catch (error) {
        setSevereError(
          "Network Error. Please check your internet connectivity."
        );
        console.error("Error fetching questions:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);
  useEffect(() => {
    async function fetch() {
      if (loginState.loggedIn) {
        const requestData = {
          username: loginState.username, // Use the username from the Redux state.
        };

        axios
          .post(`${BASE_URL}/21days/userDetails`, requestData)
          .then(function (response) {
            const { data } = response.data; // Add heatMap here if you need it.
            console.log(data);

            setLoading(false);

            setBinaryStringProblem(data.headMap);
            setPoints(data.point);
            setUrl1(data.codeforcesURL);
          })
          .catch(function (error) {
            setSevereError("Error! Posting User Name");
            console.log(error.message);
          });
      }
    }
    fetch();
  }, [loginState.loggedIn, loginState.username]);
  useEffect(() => {
    async function getHotTopic() {
      const codeForcesNames = {
        username: codeforcesName(url1),
      };
      // console.log("codeForcesNames.username : ", codeForcesNames.username);
      if (!codeForcesNames.username) {
        // console.log("codeForcesNames.username : ", codeForcesNames.username);
        return;
      };
      axios
        .post(`${BASE_URL}/21days/topicCodeForces`, codeForcesNames)
        .then(function (response) {
          const data = response.data;
          // console.log(data.binaryString);
          if (data.success == false) {
            setSevereError("Error!Posting codeForces Url");
          }
          setLoading(false);
          setBinaryStringTopic(data.binaryString);
        })
        .catch(function (error) {
          setSevereError("Error!Posting codeForces Url");
          console.log(error);
        });
    }
    getHotTopic();
  }, [url1]);
  const progress = progressBar(binaryStringProblem);

  return (
    <>
      <Navbar />
      <div className="mx-4 mt-20">
        <div className="tabs flex align-middle justify-center my-2">
          <button
            className={`tab tab-lifted text-xl ${tabActive === "Problem" && "tab-active"
              }`}
            onClick={() => {
              setTabActive("Problem");
            }}
          >
            Problem Set
          </button>
          <button
            className={`tab tab-lifted text-xl ${tabActive === "HotTopics" && "tab-active"
              }`}
            onClick={() => {
              setTabActive("HotTopics");
            }}
          >
            Hot Topics
          </button>
          <button
            className={`tab tab-lifted text-xl ${tabActive === "LeaderBoard" && "tab-active"
              }`}
            onClick={() => {
              setTabActive("LeaderBoard");
            }}
          >
            LeaderBoard
          </button>
        </div>
        {loading && <ProblemSetSkeleton />}
        {severeError ? (
          <div className="flex justify-center p-2">
            <div className="alert alert-error shadow-lg w-fit">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{severeError}</span>
              </div>
            </div>
          </div>
        ) : tabActive === "LeaderBoard" ? (
          <LeaderBoard />
        ) : (
          <div>
            <div className="text-3xl m-4 mb-9 flex items-center justify-center font-serif">
              {tabActive === "Problem" ? (
                <div className="flex justify-between w-3/4 items-center mr-20">
                  <Progress progress={progress} />
                  <h1>Problem Set</h1>
                  <div className="flex gap-3 items-center justify-center">
                    <h2>Points</h2>
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        data-name="Layer 1"
                        viewBox="0 0 512 512"
                        id="freemium"
                        height="40"
                        className="w-10 h-10"
                      >
                        <path
                          fill="#ffe966"
                          d="M504.5,256c0,25.71871-24.27006,47.28511-31.79677,70.49186-7.8009,24.05217-1.09741,55.72844-15.65127,75.74867-14.69935,20.22037-46.96177,23.5574-67.15962,38.27312-19.99787,14.57-33.05808,44.33937-57.08337,52.149-23.181,7.53516-51.11876-8.61715-76.809-8.61715s-53.62769,16.15235-76.80861,8.61726c-24.02541-7.8096-37.08574-37.579-57.08369-52.149-20.19786-14.71572-52.46028-18.05274-67.15963-38.27311-14.55381-20.02014-7.85029-51.69632-15.6512-75.74839C31.77009,303.28533,7.5,281.71884,7.5,256s24.27006-47.28511,31.79677-70.49186c7.8009-24.05217,1.09741-55.72844,15.65127-75.74867,14.69935-20.22037,46.96177-23.5574,67.15962-38.27312,19.99787-14.57,33.05808-44.33936,57.08337-52.149,23.181-7.53516,51.11875,8.61715,76.809,8.61715s53.62769-16.15235,76.80861-8.61726c24.02541,7.8096,37.08574,37.579,57.08369,52.14905,20.19786,14.71572,52.46028,18.05274,67.15963,38.27311,14.55381,20.02014,7.85029,51.69632,15.6512,75.74839C480.22991,208.71467,504.5,230.28116,504.5,256Z"
                        ></path>
                        <ellipse
                          cx="256"
                          cy="256"
                          fill="#f66"
                          rx="175.014"
                          ry="175.209"
                        ></ellipse>
                        <path
                          fill="#ff4e4e"
                          d="M233.36088,333.14993a19.304,19.304,0,0,1-13.69265-5.67155l-40.29254-40.29211A19.36464,19.36464,0,0,1,206.761,259.80012l26.59988,26.59946L335.23905,184.52141a19.36449,19.36449,0,1,1,27.38531,27.38573L247.054,327.47838A19.30568,19.30568,0,0,1,233.36088,333.14993Z"
                        ></path>
                        <path
                          fill="#fff"
                          d="M218.36088,333.14993a19.304,19.304,0,0,1-13.69265-5.67155l-40.29254-40.29211A19.36464,19.36464,0,0,1,191.761,259.80012l26.59988,26.59946L320.23905,184.52141a19.36449,19.36449,0,1,1,27.38531,27.38573L232.054,327.47838A19.30568,19.30568,0,0,1,218.36088,333.14993Z"
                        ></path>
                        <path
                          fill="#272a33"
                          d="M256,73.291C155.36182,73.291,73.48633,155.25391,73.48633,256S155.36182,438.709,256,438.709,438.51367,356.74609,438.51367,256,356.63818,73.291,256,73.291Zm0,350.418C163.63281,423.709,88.48633,348.4751,88.48633,256S163.63281,88.291,256,88.291,423.51367,163.5249,423.51367,256,348.36719,423.709,256,423.709ZM333.93164,171.3501a26.68717,26.68717,0,0,0-18.9956,7.86816L218.36084,275.793l-21.29639-21.2959a26.86453,26.86453,0,1,0-37.99218,37.99219l40.293,40.29248a26.86521,26.86521,0,0,0,37.99219,0L352.92773,217.21045a26.86426,26.86426,0,0,0-18.99609-45.86035Zm8.38965,35.2539L226.75146,322.17432a11.86536,11.86536,0,0,1-16.77978.001l-40.293-40.29248a11.86475,11.86475,0,0,1,16.7793-16.77929l26.59961,26.59912a7.50021,7.50021,0,0,0,10.60644,0L325.543,189.82471A11.86441,11.86441,0,1,1,342.32129,206.604Zm151.08935,2.20655c-5.58789-8.88037-10.86572-17.26856-13.57324-25.6167-2.87842-8.87549-3.60351-19.10108-4.3706-29.92725-1.19434-16.84912-2.42871-34.272-12.34864-47.91748C453.09229,91.55762,436.84424,85,421.13135,78.6582c-9.9834-4.02929-19.4126-7.835-26.82276-13.2334-7.2705-5.29736-13.70947-13.02734-20.52588-21.21142-10.91894-13.10791-22.209-26.6626-38.65576-32.00879-15.73535-5.11475-32.51562-.94678-48.7417,3.08545C276.165,17.8291,265.59717,20.45459,256,20.45459S235.83447,17.8291,225.61426,15.29c-16.22656-4.03125-33.00586-8.2002-48.7417-3.08545-16.44629,5.34619-27.73633,18.90039-38.65479,32.0083C131.40088,52.397,124.96191,60.127,117.69092,65.4248c-7.41016,5.39844-16.83936,9.20459-26.82276,13.2334C75.15527,85,58.90771,91.55762,48.88184,105.34912c-9.91993,13.64551-11.1543,31.06836-12.34864,47.918-.76709,10.82617-1.49218,21.05176-4.3706,29.92725-2.70752,8.34765-7.98535,16.73584-13.57276,25.61621C9.4502,223.33545,0,238.355,0,256s9.4502,32.66455,18.58936,47.18945c5.58789,8.88037,10.86572,17.26856,13.57324,25.6167,2.87842,8.87549,3.60351,19.10108,4.3706,29.92725,1.19434,16.84912,2.42871,34.272,12.34864,47.91748C58.90771,420.44238,75.15576,427,90.86865,433.3418c9.9834,4.02929,19.4126,7.835,26.82276,13.2334,7.2705,5.29736,13.70947,13.02734,20.52588,21.21142,10.91894,13.10791,22.209,26.6626,38.65576,32.00879,15.73486,5.11426,32.51465.9458,48.7417-3.08545C235.835,494.1709,246.40283,491.54541,256,491.54541s20.16553,2.62549,30.38574,5.16455c10.855,2.69678,21.9541,5.45459,32.82569,5.45459a51.08706,51.08706,0,0,0,15.916-2.36914c16.44629-5.34619,27.73633-18.90039,38.65479-32.0083,6.81689-8.18408,13.25586-15.91406,20.52685-21.21191,7.41016-5.39844,16.83936-9.20459,26.82276-13.2334,15.71289-6.3418,31.96045-12.89942,41.98632-26.69092,9.91993-13.64551,11.1543-31.06836,12.34864-47.918.76709-10.82617,1.49218-21.05176,4.3706-29.92725,2.70752-8.34765,7.98535-16.73584,13.57276-25.61621C502.5498,288.66455,512,273.645,512,256S502.5498,223.33545,493.41064,208.81055Zm-12.69628,86.39062c-5.83106,9.26758-11.86133,18.85059-15.14551,28.97656-3.44336,10.6167-4.26758,22.24756-5.06446,33.49463-1.09277,15.42139-2.12548,29.9878-9.519,40.15821-7.49609,10.312-21.083,15.79541-35.46777,21.60107-10.38916,4.19336-21.13233,8.5293-30.04151,15.02-8.77343,6.39258-16.11718,15.209-23.21923,23.73535-9.9961,12.00049-19.4375,23.33545-31.76612,27.34278-11.6499,3.78808-25.6582.30761-40.48828-3.377C278.90625,479.396,267.43262,476.54541,256,476.54541s-22.90625,2.85059-34.00195,5.60693c-14.82862,3.68506-28.83545,7.165-40.48828,3.37745-12.32911-4.00733-21.771-15.34278-31.76709-27.34375-7.10157-8.52588-14.44532-17.3418-23.21827-23.73389-8.90918-6.49121-19.65234-10.82715-30.0415-15.02051-14.38477-5.80566-27.97217-11.28906-35.46826-21.60107-7.39356-10.17041-8.42627-24.73633-9.519-40.15772-.79688-11.24756-1.6211-22.87793-5.06446-33.49463-3.28467-10.12646-9.31445-19.70947-15.14551-28.97754C22.91064,281.89062,15,269.31836,15,256c0-13.31885,7.91064-25.89062,16.28564-39.20117,5.83106-9.26758,11.86133-18.85059,15.14551-28.97656,3.44336-10.6167,4.26758-22.24756,5.06446-33.49463,1.09277-15.42139,2.12548-29.9878,9.519-40.15821,7.49609-10.312,21.083-15.79541,35.46777-21.60107,10.38916-4.19336,21.13233-8.5293,30.04151-15.02,8.77343-6.39258,16.11718-15.209,23.21923-23.73535,9.9961-12.00049,19.4375-23.33545,31.76612-27.34278,11.65039-3.78857,25.6582-.30712,40.48828,3.377C233.09375,32.604,244.56738,35.45459,256,35.45459s22.90625-2.85059,34.002-5.60693c14.8291-3.68457,28.83692-7.16455,40.48828-3.37745,12.32911,4.00733,21.771,15.34278,31.76709,27.34375,7.10157,8.52588,14.44532,17.3418,23.21827,23.73389,8.90918,6.49121,19.65234,10.82715,30.0415,15.02051,14.38477,5.80566,27.97217,11.28906,35.46826,21.60107,7.39356,10.17041,8.42627,24.73633,9.519,40.15772.79688,11.24756,1.6211,22.87793,5.06446,33.49463,3.28467,10.12646,9.31445,19.70947,15.14551,28.97754C489.08936,230.10938,497,242.68164,497,256,497,269.31885,489.08936,281.89062,480.71436,295.20117Z"
                        ></path>
                      </svg>

                      <h2>{points}</h2>
                    </div>
                  </div>
                </div>
              ) : (
                <h1>Hot Topics</h1>
              )}
            </div>
            {tabActive === "Problem" ? (
              <>
                <ProblemTable
                  problems={problems}
                  binaryStringProblem={binaryStringProblem}
                />

                <AlertError alert={alert} />
              </>
            ) : (
              <>
                <HotTopics binaryStringTopic={binaryStringTopic} />
                <AlertError alert={alert} />
              </>
            )}
          </div>
        )}
      </div>
      <TheFooter />
    </>
  );
}

export default ProblemSet;
