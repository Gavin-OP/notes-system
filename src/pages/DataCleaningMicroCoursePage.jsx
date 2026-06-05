import { useMemo, useState } from "react";
import { Alert, Button, Card, Progress, Space, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import "./DataCleaningMicroCoursePage.css";

const { Paragraph, Text, Title } = Typography;

const SOURCE_NOTE_URL = "/note/data-science/data-cleaning-preprocessing.md";

const messyRows = [
  { customerId: 1, age: "28", income: "50000", purchases: 5, issues: [] },
  { customerId: 2, age: "35", income: "60000", purchases: 8, issues: [] },
  { customerId: 3, age: "NaN", income: "75000", purchases: 12, issues: ["missing"] },
  { customerId: 4, age: "42", income: "NaN", purchases: 6, issues: ["missing"] },
  { customerId: 5, age: "30", income: "55000", purchases: 7, issues: [] },
  { customerId: 6, age: "150", income: "52000", purchases: 6, issues: ["outlier"] },
];

const workflowSteps = [
  "Load Data",
  "Understand Data with EDA",
  "Handle Missing Data",
  "Handle Outliers",
  "Transform Features",
  "Feature Engineering",
  "Split Data",
];

const course = {
  title: "Data Cleaning and Preprocessing",
  subtitle:
    "A fuller interactive micro-course rebuilt from the original Data Science note, with modules, checkpoints, and practice decisions.",
  sourceNote: "public/notes/data-science/data-cleaning-preprocessing.md",
  estimatedMinutes: 18,
  objectives: [
    "Explain why cleaning and preprocessing are essential before modeling.",
    "Identify missing values and outliers, and explain why they matter.",
    "Apply basic missing-data strategies: dropping, mean, median, mode, ffill, and bfill.",
    "Detect and address outliers using visual inspection, Z-score, IQR, removal, capping, or transformation.",
    "Prepare features with categorical encoding and feature scaling while avoiding data leakage.",
  ],
  modules: [
    {
      id: "orientation",
      title: "Orientation",
      shortTitle: "Overview",
      goal: "Understand why preprocessing is the foundation for reliable analysis and machine learning.",
      lessons: [
        {
          id: "chef-analogy",
          eyebrow: "Introduction",
          title: "Clean data is like prepared ingredients",
          body:
            "The original note compares preprocessing to preparing ingredients before cooking. You wash, trim, chop, and organize ingredients before making a meal. Data science works the same way: before building models or extracting insights, raw data needs to be cleaned and prepared.",
          interaction: "overview",
        },
        {
          id: "course-map",
          eyebrow: "Course structure",
          title: "What this micro-course covers",
          body:
            "The course follows the same path as the note: first identify messy data, then handle missing values, handle outliers, transform features, and finally put everything into a robust preprocessing workflow.",
          interaction: "map",
        },
      ],
    },
    {
      id: "messy-data",
      title: "Understanding Messy Data",
      shortTitle: "Messy Data",
      goal: "Identify missing values and outliers, and understand how they can damage analysis or model performance.",
      lessons: [
        {
          id: "missing-data",
          eyebrow: "Missing Data",
          title: "Missing values are blank spaces in the dataset",
          body:
            "The note describes missing data as the absence of a value in an observation or variable. In Python, Pandas often represents this as NaN or None. Missing values can introduce bias, make many models fail, and reduce the information available for analysis.",
          interaction: "messy-table",
          activeIssue: "missing",
        },
        {
          id: "outlier-data",
          eyebrow: "Outliers",
          title: "Outliers sit far away from the rest of the data",
          body:
            "Outliers can be genuine extreme values, measurement errors, or data entry mistakes. The original example uses Age = 150 as an obvious anomaly. Outliers can distort the mean and standard deviation, pull sensitive models away from true patterns, and create false discoveries.",
          interaction: "messy-table",
          activeIssue: "outlier",
        },
        {
          id: "messy-checkpoint",
          eyebrow: "Checkpoint",
          title: "Which issue is most likely to make a model crash?",
          body: "Many machine learning algorithms require complete numerical data.",
          interaction: "quiz",
          quiz: {
            correctOptionId: "missing",
            options: [
              {
                id: "missing",
                label: "Missing values in Age or Income",
                feedback:
                  "Correct. Many algorithms cannot handle missing values directly, so the model may crash or produce invalid results.",
              },
              {
                id: "outlier",
                label: "An unusually high but valid income",
                feedback:
                  "Outliers can distort statistics and models, but missing values are the issue most likely to directly break algorithms that expect complete data.",
              },
              {
                id: "large",
                label: "A feature with a large numeric range",
                feedback:
                  "Large ranges can dominate distance-based models, but that is a scaling problem rather than the most direct crash risk.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "missing-values",
      title: "Handling Missing Data",
      shortTitle: "Missing Data",
      goal: "Choose imputation strategies based on missingness, feature type, and distribution.",
      lessons: [
        {
          id: "dropping",
          eyebrow: "Strategy 1",
          title: "Dropping rows or columns is simple, but can lose information",
          body:
            "The note recommends dropping rows when only a small percentage of rows are missing and the dataset is large. If a column has a very high missing rate, such as 70-80% or more, dropping the column may be better because it provides little useful information.",
          interaction: "imputation",
          activeStrategy: "drop",
        },
        {
          id: "central-tendency",
          eyebrow: "Strategy 2",
          title: "Mean, median, and mode fill gaps with typical values",
          body:
            "Mean imputation works best for numerical data that is approximately normal and does not have strong outliers. Median is more robust for skewed data or data with extreme values. Mode is useful for categorical data or values that repeat frequently.",
          interaction: "imputation",
          activeStrategy: "median",
        },
        {
          id: "forward-backward-fill",
          eyebrow: "Strategy 3",
          title: "Forward fill and backward fill depend on row order",
          body:
            "Forward fill propagates the last valid observation forward, while backward fill uses the next valid observation. The note emphasizes these are especially useful for time-series data or data where the order of observations matters.",
          interaction: "imputation",
          activeStrategy: "ffill",
        },
        {
          id: "imputation-checkpoint",
          eyebrow: "Checkpoint",
          title: "Choose the best beginner strategy",
          body:
            "Age has missing values, and the dataset may contain an extreme Age value. Which central-tendency imputation is most robust?",
          interaction: "quiz",
          quiz: {
            correctOptionId: "median",
            options: [
              {
                id: "mean",
                label: "Mean imputation",
                feedback:
                  "Mean is sensitive to outliers, so an extreme value can pull the replacement value away from the typical case.",
              },
              {
                id: "median",
                label: "Median imputation",
                feedback:
                  "Correct. The note describes median as more robust to outliers and skewed distributions.",
              },
              {
                id: "ffill",
                label: "Forward fill",
                feedback:
                  "Forward fill is more appropriate when row order matters, such as time-series data.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "outliers",
      title: "Detecting and Addressing Outliers",
      shortTitle: "Outliers",
      goal: "Detect outliers with visual and statistical methods, then choose an appropriate treatment.",
      lessons: [
        {
          id: "identify-outliers",
          eyebrow: "Detection",
          title: "Use plots, Z-score, or IQR to identify outliers",
          body:
            "The note lists visual inspection, Z-score, and IQR as common methods. Box plots, scatter plots, and histograms reveal unusual points visually. Z-score flags values far from the mean when data is roughly normal. IQR flags values below Q1 - 1.5 * IQR or above Q3 + 1.5 * IQR and is robust to skewed data.",
          interaction: "outlier-detection",
        },
        {
          id: "handle-outliers",
          eyebrow: "Treatment",
          title: "Remove, cap, or transform outliers based on their cause",
          body:
            "The note is careful here: remove outliers only when you have strong reason to believe they are errors. Capping, also called winsorization, replaces values beyond a bound with that bound. Mathematical transformations such as log or square root can reduce the impact of extreme values by compressing the range.",
          interaction: "outlier-treatment",
        },
        {
          id: "outlier-checkpoint",
          eyebrow: "Checkpoint",
          title: "Which method does not assume normality?",
          body: "You want an outlier detection method that is robust to skewed data.",
          interaction: "quiz",
          quiz: {
            correctOptionId: "iqr",
            options: [
              {
                id: "zscore",
                label: "Z-score",
                feedback:
                  "Z-score is useful, but the note says it assumes the data is somewhat normally distributed.",
              },
              {
                id: "iqr",
                label: "Interquartile Range (IQR)",
                feedback:
                  "Correct. IQR is described as robust to skewed data and does not assume a normal distribution.",
              },
              {
                id: "mean",
                label: "Mean comparison",
                feedback:
                  "The mean is sensitive to outliers, so it is not the robust choice here.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "transformations",
      title: "Transforming Data for Better Models",
      shortTitle: "Transform",
      goal: "Convert categorical variables and scale numerical features so models can learn from them effectively.",
      lessons: [
        {
          id: "categorical-encoding",
          eyebrow: "Categorical Encoding",
          title: "Turn categories into numbers without inventing meaning",
          body:
            "Many machine learning algorithms require numerical input. Label encoding assigns integers and works best for ordinal categories such as Small, Medium, Large. One-hot encoding creates binary columns and is ideal for nominal categories such as City because it avoids implying order.",
          interaction: "encoding",
        },
        {
          id: "feature-scaling",
          eyebrow: "Feature Scaling",
          title: "Scale numerical features to a standard range",
          body:
            "The note explains that scaling matters for distance-based algorithms, gradient descent, and regularization. If Salary ranges from 10,000 to 1,000,000 while Age ranges from 0 to 100, the larger scale can dominate distance calculations.",
          interaction: "scaling",
        },
        {
          id: "scaling-methods",
          eyebrow: "Standardization vs Normalization",
          title: "Choose between Z-score scaling and Min-Max scaling",
          body:
            "Standardization transforms data to mean 0 and standard deviation 1 using (x - mean) / standard deviation. Min-Max normalization scales data to a fixed range, usually 0 to 1, using (x - min) / (max - min). Normalization is highly sensitive to outliers because min and max define the range.",
          interaction: "scaling-methods",
        },
        {
          id: "transform-checkpoint",
          eyebrow: "Checkpoint",
          title: "Which encoding should City use?",
          body: "City has values such as New York, London, and Paris. There is no natural order.",
          interaction: "quiz",
          quiz: {
            correctOptionId: "one-hot",
            options: [
              {
                id: "label",
                label: "Label encoding",
                feedback:
                  "That would assign integers and could imply a fake order between cities.",
              },
              {
                id: "one-hot",
                label: "One-hot encoding",
                feedback:
                  "Correct. The note says one-hot encoding is ideal for nominal data with no inherent order.",
              },
              {
                id: "mean",
                label: "Mean imputation",
                feedback:
                  "Mean imputation fills missing numerical values; it is not an encoding method for nominal categories.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "workflow",
      title: "Putting It All Together",
      shortTitle: "Workflow",
      goal: "Assemble the complete preprocessing workflow and avoid data leakage.",
      lessons: [
        {
          id: "workflow-order",
          eyebrow: "Workflow",
          title: "Preprocessing is iterative, but the workflow still has a logic",
          body:
            "The note's workflow starts by loading data and understanding it with EDA. Then it handles missing values, handles outliers, transforms features, optionally engineers features, and finally splits the cleaned data into training and testing sets.",
          interaction: "workflow",
        },
        {
          id: "data-leakage",
          eyebrow: "Important warning",
          title: "Split data carefully to avoid leakage",
          body:
            "The original note specifically warns that scaling and encoding should be performed after splitting to prevent data leakage from the test set into the training process. Leakage can make model performance look better than it truly is.",
          interaction: "leakage",
        },
        {
          id: "final-case",
          eyebrow: "Final case",
          title: "Build a preprocessing plan for the customer dataset",
          body:
            "Use the same customer-style dataset from the note: Age and Income contain missing values, Age has an outlier of 150, City is nominal, and Salary or Years Experience may require scaling for distance-based or gradient-based models.",
          interaction: "final-case",
        },
      ],
    },
  ],
};

const moduleStartIndexes = course.modules.reduce((acc, module, moduleIndex) => {
  const previousCount = course.modules
    .slice(0, moduleIndex)
    .reduce((sum, item) => sum + item.lessons.length, 0);
  acc[module.id] = previousCount;
  return acc;
}, {});

const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);

function getGlobalLessonNumber(moduleIndex, lessonIndex) {
  return (
    course.modules.slice(0, moduleIndex).reduce((sum, module) => sum + module.lessons.length, 0) +
    lessonIndex +
    1
  );
}

function DataCleaningMicroCoursePage() {
  const navigate = useNavigate();
  const [moduleIndex, setModuleIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [activeIssue, setActiveIssue] = useState("missing");
  const [activeStrategy, setActiveStrategy] = useState("median");
  const [activeDetection, setActiveDetection] = useState("iqr");
  const [activeOutlierOption, setActiveOutlierOption] = useState("cap");
  const [activeEncoding, setActiveEncoding] = useState("one-hot");
  const [activeScaling, setActiveScaling] = useState("standard");
  const [selectedQuizOptionId, setSelectedQuizOptionId] = useState("");

  const currentModule = course.modules[moduleIndex];
  const currentLesson = currentModule.lessons[lessonIndex];
  const currentLessonNumber = getGlobalLessonNumber(moduleIndex, lessonIndex);
  const progressPercent = Math.round((currentLessonNumber / totalLessons) * 100);

  const selectedQuizOption = useMemo(() => {
    if (!currentLesson.quiz || !selectedQuizOptionId) return null;
    return currentLesson.quiz.options.find((option) => option.id === selectedQuizOptionId) || null;
  }, [currentLesson, selectedQuizOptionId]);

  function goTo(moduleTargetIndex, lessonTargetIndex = 0) {
    setModuleIndex(moduleTargetIndex);
    setLessonIndex(lessonTargetIndex);
    setSelectedQuizOptionId("");
    if (course.modules[moduleTargetIndex].lessons[lessonTargetIndex]?.activeIssue) {
      setActiveIssue(course.modules[moduleTargetIndex].lessons[lessonTargetIndex].activeIssue);
    }
    if (course.modules[moduleTargetIndex].lessons[lessonTargetIndex]?.activeStrategy) {
      setActiveStrategy(course.modules[moduleTargetIndex].lessons[lessonTargetIndex].activeStrategy);
    }
  }

  function goNext() {
    if (lessonIndex + 1 < currentModule.lessons.length) {
      goTo(moduleIndex, lessonIndex + 1);
      return;
    }
    if (moduleIndex + 1 < course.modules.length) {
      goTo(moduleIndex + 1, 0);
    }
  }

  function goPrevious() {
    if (lessonIndex > 0) {
      goTo(moduleIndex, lessonIndex - 1);
      return;
    }
    if (moduleIndex > 0) {
      const previousModule = course.modules[moduleIndex - 1];
      goTo(moduleIndex - 1, previousModule.lessons.length - 1);
    }
  }

  function renderMessyTable(defaultIssue) {
    const visibleIssue = defaultIssue || activeIssue;
    return (
      <div className="data-cleaning-course__dataset-lab">
        <div className="data-cleaning-course__toggle-row">
          {[
            ["missing", "Missing values"],
            ["outlier", "Outlier"],
            ["clean", "Clean rows"],
          ].map(([issue, label]) => (
            <button
              className={`data-cleaning-course__pill ${visibleIssue === issue ? "is-active" : ""}`}
              key={issue}
              onClick={() => setActiveIssue(issue)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="data-cleaning-course__table" role="table" aria-label="Messy customer data">
          <div className="data-cleaning-course__table-row is-header" role="row">
            <span>CustomerID</span>
            <span>Age</span>
            <span>Income</span>
            <span>Purchases</span>
          </div>
          {messyRows.map((row) => {
            const isHighlighted =
              visibleIssue === "clean" ? row.issues.length === 0 : row.issues.includes(visibleIssue);
            return (
              <div
                className={`data-cleaning-course__table-row ${isHighlighted ? "is-highlighted" : ""}`}
                key={row.customerId}
                role="row"
              >
                <span>{row.customerId}</span>
                <span>{row.age}</span>
                <span>{row.income}</span>
                <span>{row.purchases}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderImputation() {
    const strategies = [
      {
        id: "drop",
        label: "Drop rows or columns",
        bestFor: "Small row-level missingness, or columns with very high missing rates.",
        caution: "Can reduce dataset size or introduce bias when missingness is not random.",
      },
      {
        id: "mean",
        label: "Mean",
        bestFor: "Numerical data that is roughly normal and does not have strong outliers.",
        caution: "Sensitive to extreme values.",
      },
      {
        id: "median",
        label: "Median",
        bestFor: "Numerical data with skew or outliers.",
        caution: "More robust than the mean, but still simplifies the feature distribution.",
      },
      {
        id: "mode",
        label: "Mode",
        bestFor: "Categorical data or values where one category/value appears most often.",
        caution: "Can over-represent the most common value.",
      },
      {
        id: "ffill",
        label: "ffill / bfill",
        bestFor: "Time-series or ordered data where neighboring rows carry meaning.",
        caution: "Can be misleading if row order is arbitrary.",
      },
    ];
    const selected = strategies.find((strategy) => strategy.id === activeStrategy);

    return (
      <div className="data-cleaning-course__decision-grid">
        {strategies.map((strategy) => (
          <button
            className={`data-cleaning-course__decision-card ${activeStrategy === strategy.id ? "is-active" : ""}`}
            key={strategy.id}
            onClick={() => setActiveStrategy(strategy.id)}
            type="button"
          >
            <strong>{strategy.label}</strong>
            <span>{strategy.bestFor}</span>
          </button>
        ))}
        <Alert
          className="data-cleaning-course__wide-feedback"
          description={selected.caution}
          message={`Trade-off: ${selected.label}`}
          showIcon
          type="warning"
        />
      </div>
    );
  }

  function renderOutlierDetection() {
    const methods = [
      {
        id: "visual",
        label: "Visual inspection",
        summary: "Box plots, scatter plots, and histograms quickly reveal unusual points.",
      },
      {
        id: "zscore",
        label: "Z-score",
        summary: "Flags values many standard deviations from the mean; best for roughly normal data.",
      },
      {
        id: "iqr",
        label: "IQR",
        summary: "Flags values outside Q1 - 1.5 * IQR and Q3 + 1.5 * IQR; robust to skew.",
      },
    ];
    const selected = methods.find((method) => method.id === activeDetection);

    return (
      <div className="data-cleaning-course__outlier-lab">
        <div className="data-cleaning-course__outlier-chart" aria-label="Outlier age chart">
          {[28, 35, 42, 30, 150].map((age) => (
            <span
              className={age === 150 ? "is-outlier" : ""}
              key={age}
              style={{ height: `${Math.max(24, age)}px` }}
              title={`Age ${age}`}
            />
          ))}
        </div>
        <div className="data-cleaning-course__choice-stack">
          {methods.map((method) => (
            <button
              className={`data-cleaning-course__choice ${activeDetection === method.id ? "is-active" : ""}`}
              key={method.id}
              onClick={() => setActiveDetection(method.id)}
              type="button"
            >
              {method.label}
            </button>
          ))}
        </div>
        <Alert
          className="data-cleaning-course__wide-feedback"
          description={selected.summary}
          message={`Detection method: ${selected.label}`}
          showIcon
          type="info"
        />
      </div>
    );
  }

  function renderOutlierTreatment() {
    const options = [
      {
        id: "remove",
        label: "Remove",
        preview: "Exclude the row where Age is above the calculated upper bound.",
        takeaway: "Use only when the value is clearly an error or will not generalize.",
      },
      {
        id: "cap",
        label: "Cap / Winsorize",
        preview: "Replace Age 150 with the calculated upper bound.",
        takeaway: "Keeps the row while reducing the extreme influence.",
      },
      {
        id: "transform",
        label: "Transform",
        preview: "Apply a log or square-root transform to compress large values.",
        takeaway: "Can reduce outlier impact, especially for skewed ranges.",
      },
    ];
    const selected = options.find((option) => option.id === activeOutlierOption);

    return (
      <div className="data-cleaning-course__outlier-lab">
        <div className="data-cleaning-course__mini-table">
          <span>Original Age</span>
          <strong>150</strong>
          <span>Selected treatment</span>
          <strong>{selected.label}</strong>
        </div>
        <div className="data-cleaning-course__choice-stack">
          {options.map((option) => (
            <button
              className={`data-cleaning-course__choice ${activeOutlierOption === option.id ? "is-active" : ""}`}
              key={option.id}
              onClick={() => setActiveOutlierOption(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <Alert
          className="data-cleaning-course__wide-feedback"
          description={selected.takeaway}
          message={selected.preview}
          showIcon
          type="info"
        />
      </div>
    );
  }

  function renderEncoding() {
    const choices = [
      {
        id: "label",
        label: "Label Encoding",
        feature: "Size: Small, Medium, Large",
        output: "Small -> 0, Medium -> 1, Large -> 2",
        why: "Good fit for ordinal data because there is a meaningful order.",
      },
      {
        id: "one-hot",
        label: "One-Hot Encoding",
        feature: "City: London, New York, Paris",
        output: "City_London, City_New York, City_Paris",
        why: "Good fit for nominal data because it avoids implying order.",
      },
    ];
    const selected = choices.find((choice) => choice.id === activeEncoding);

    return (
      <div className="data-cleaning-course__encoding-grid">
        {choices.map((choice) => (
          <button
            className={`data-cleaning-course__encoding-card ${activeEncoding === choice.id ? "is-active" : ""}`}
            key={choice.id}
            onClick={() => setActiveEncoding(choice.id)}
            type="button"
          >
            <Tag color="blue">{choice.label}</Tag>
            <strong>{choice.feature}</strong>
            <span>{choice.output}</span>
          </button>
        ))}
        <Alert
          className="data-cleaning-course__wide-feedback"
          description={selected.why}
          message={selected.label}
          showIcon
          type="success"
        />
      </div>
    );
  }

  function renderScaling() {
    return (
      <div className="data-cleaning-course__scaling-lab">
        <div className="data-cleaning-course__range-demo" aria-label="Feature range comparison">
          <div>
            <Text strong>Before scaling</Text>
            <span className="data-cleaning-course__bar is-salary">Salary: 45k to 120k</span>
            <span className="data-cleaning-course__bar is-years">YearsExp: 1 to 15</span>
          </div>
          <div>
            <Text strong>After scaling</Text>
            <span className="data-cleaning-course__bar is-scaled">Salary scaled</span>
            <span className="data-cleaning-course__bar is-scaled">YearsExp scaled</span>
          </div>
        </div>
        <Alert
          className="data-cleaning-course__wide-feedback"
          description="Distance-based algorithms, gradient descent, and regularization can all behave better when numerical features are on comparable scales."
          message="Why scaling matters"
          showIcon
          type="info"
        />
      </div>
    );
  }

  function renderScalingMethods() {
    const methods = [
      {
        id: "standard",
        label: "Standardization",
        formula: "(x - mean) / standard deviation",
        bestFor:
          "Transforms data to mean 0 and standard deviation 1. Useful when a model expects normally distributed inputs.",
      },
      {
        id: "normalize",
        label: "Min-Max Normalization",
        formula: "(x - min) / (max - min)",
        bestFor:
          "Scales values to a fixed range, usually 0 to 1, but is highly sensitive to outliers.",
      },
    ];
    const selected = methods.find((method) => method.id === activeScaling);

    return (
      <div className="data-cleaning-course__decision-grid">
        {methods.map((method) => (
          <button
            className={`data-cleaning-course__decision-card ${activeScaling === method.id ? "is-active" : ""}`}
            key={method.id}
            onClick={() => setActiveScaling(method.id)}
            type="button"
          >
            <strong>{method.label}</strong>
            <span>{method.formula}</span>
          </button>
        ))}
        <Alert
          className="data-cleaning-course__wide-feedback"
          description={selected.bestFor}
          message={selected.label}
          showIcon
          type="info"
        />
      </div>
    );
  }

  function renderWorkflow() {
    return (
      <div className="data-cleaning-course__workflow">
        {workflowSteps.map((step, index) => (
          <div className="data-cleaning-course__workflow-step" key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
    );
  }

  function renderFinalCase() {
    return (
      <div className="data-cleaning-course__case-grid">
        <Card bordered={false}>
          <Tag color="orange">Problem</Tag>
          <Paragraph>Age and Income have missing values; Age also contains 150.</Paragraph>
        </Card>
        <Card bordered={false}>
          <Tag color="green">Plan</Tag>
          <Paragraph>Quantify missingness, impute carefully, detect outliers with visual/IQR checks, then cap/remove/transform based on cause.</Paragraph>
        </Card>
        <Card bordered={false}>
          <Tag color="blue">Transform</Tag>
          <Paragraph>Use one-hot encoding for nominal City, label encoding only for ordinal Size, and scale numerical features when the model needs it.</Paragraph>
        </Card>
        <Card bordered={false}>
          <Tag color="purple">Guardrail</Tag>
          <Paragraph>Split data before fitting scalers or encoders so test-set information does not leak into training.</Paragraph>
        </Card>
      </div>
    );
  }

  function renderQuiz(quiz) {
    const isCorrect = selectedQuizOptionId === quiz.correctOptionId;
    return (
      <div className="data-cleaning-course__quiz">
        <div className="data-cleaning-course__quiz-options">
          {quiz.options.map((option) => (
            <button
              className={`data-cleaning-course__quiz-option ${selectedQuizOptionId === option.id ? "is-selected" : ""}`}
              key={option.id}
              onClick={() => setSelectedQuizOptionId(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {selectedQuizOption ? (
          <Alert
            description={selectedQuizOption.feedback}
            message={isCorrect ? "Correct" : "Not quite"}
            showIcon
            type={isCorrect ? "success" : "info"}
          />
        ) : null}
      </div>
    );
  }

  function renderInteraction(lesson) {
    if (lesson.interaction === "overview") {
      return (
        <Alert
          className="data-cleaning-course__callout"
          description="The micro-course keeps the same concept flow as the source note, but turns the long reading into structured practice."
          message="Learning promise"
          showIcon
          type="info"
        />
      );
    }
    if (lesson.interaction === "map") return renderWorkflow();
    if (lesson.interaction === "messy-table") return renderMessyTable(lesson.activeIssue);
    if (lesson.interaction === "imputation") return renderImputation();
    if (lesson.interaction === "outlier-detection") return renderOutlierDetection();
    if (lesson.interaction === "outlier-treatment") return renderOutlierTreatment();
    if (lesson.interaction === "encoding") return renderEncoding();
    if (lesson.interaction === "scaling") return renderScaling();
    if (lesson.interaction === "scaling-methods") return renderScalingMethods();
    if (lesson.interaction === "workflow") return renderWorkflow();
    if (lesson.interaction === "leakage") {
      return (
        <Alert
          className="data-cleaning-course__callout"
          description="Fit preprocessing transformations using training data only. Then apply the learned transformation to validation/test data."
          message="Avoid overly optimistic evaluation"
          showIcon
          type="warning"
        />
      );
    }
    if (lesson.interaction === "final-case") return renderFinalCase();
    if (lesson.interaction === "quiz") return renderQuiz(lesson.quiz);
    return null;
  }

  return (
    <main className="data-cleaning-course">
      <section className="data-cleaning-course__shell">
        <div className="data-cleaning-course__hero">
          <Space direction="vertical" size={10}>
            <Tag color="purple">Structured interactive micro-course</Tag>
            <Title>{course.title}</Title>
            <Paragraph>{course.subtitle}</Paragraph>
            <Text type="secondary">
              Source note: {course.sourceNote} · About {course.estimatedMinutes} minutes
            </Text>
          </Space>
          <Button onClick={() => navigate(SOURCE_NOTE_URL)}>Open original note</Button>
        </div>

        <Card className="data-cleaning-course__objectives" bordered={false}>
          {course.objectives.map((objective) => (
            <Tag color="geekblue" key={objective}>
              {objective}
            </Tag>
          ))}
        </Card>

        <div className="data-cleaning-course__layout">
          <aside className="data-cleaning-course__sidebar">
            <Text strong>Course Modules</Text>
            <div className="data-cleaning-course__module-list">
              {course.modules.map((module, index) => (
                <button
                  className={`data-cleaning-course__module-button ${moduleIndex === index ? "is-active" : ""}`}
                  key={module.id}
                  onClick={() => goTo(index, 0)}
                  type="button"
                >
                  <span>{index + 1}</span>
                  <strong>{module.shortTitle}</strong>
                  <small>{module.lessons.length} lessons</small>
                </button>
              ))}
            </div>
          </aside>

          <Card className="data-cleaning-course__stage" bordered={false}>
            <div className="data-cleaning-course__progress-row">
              <Text strong>
                Lesson {currentLessonNumber} of {totalLessons}
              </Text>
              <Progress percent={progressPercent} showInfo={false} />
            </div>

            <div className="data-cleaning-course__module-header">
              <Tag color="cyan">Module {moduleIndex + 1}</Tag>
              <Title level={3}>{currentModule.title}</Title>
              <Paragraph>{currentModule.goal}</Paragraph>
            </div>

            <div className="data-cleaning-course__lesson-tabs">
              {currentModule.lessons.map((lesson, index) => (
                <button
                  className={`data-cleaning-course__lesson-tab ${lessonIndex === index ? "is-active" : ""}`}
                  key={lesson.id}
                  onClick={() => goTo(moduleIndex, index)}
                  type="button"
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="data-cleaning-course__slide">
              <Tag color="blue">{currentLesson.eyebrow}</Tag>
              <Title level={2}>{currentLesson.title}</Title>
              <Paragraph>{currentLesson.body}</Paragraph>
              {renderInteraction(currentLesson)}
            </div>

            <div className="data-cleaning-course__controls">
              <Button disabled={moduleIndex === 0 && lessonIndex === 0} onClick={goPrevious}>
                Previous
              </Button>
              <Text type="secondary">
                Module start: lesson {moduleStartIndexes[currentModule.id] + 1}
              </Text>
              <Button
                disabled={
                  moduleIndex === course.modules.length - 1 &&
                  lessonIndex === currentModule.lessons.length - 1
                }
                onClick={goNext}
                type="primary"
              >
                Next
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default DataCleaningMicroCoursePage;
