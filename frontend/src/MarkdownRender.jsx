
import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const _mapProps = (props) => ({
  ...props,
  remarkPlugins: [
    RemarkMathPlugin
  ],
  components: {
    ...props.components,
    math: ({ value }) => <BlockMath>{value}</BlockMath>,
    inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>
  }
});

const MarkdownRender = (props) => <ReactMarkdown 
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex]}
    {..._mapProps(props)} />;

export default MarkdownRender;