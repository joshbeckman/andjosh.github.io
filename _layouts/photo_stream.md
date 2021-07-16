---
layout: wide
---

<div class="tag-lead">
  {{ content }}
</div>
<div class="photo-stream">
<ul class="grid">
  {% if site.tags[page.slug] %}
    {% for post in site.tags[page.slug] %}
      <li class="item " id="{{ post.url }}" style="" title="{{ post.title | default: post.date }}">
        <img class="lazyload" data-src="{{ post.image }}" src="" height="" width="" />
        <span class="full">
          <span style="background-image: url('{{ post.image }}')"></span>
        </span>
        <a class="open" href="{{ post.url }}" data-target="{{ post.url }}">Open</a>
        <a class="close" href="{{ page.url }}">Close</a>
      </li>
    {% endfor %}
  {% else %}
    <blockquote>
      <p>There are no posts with this tag.</p>
    </blockquote>
    <p>View <a href="/posts">all posts</a>.</p>
  {% endif %}
</ul>
</div>
{% include photo_stream.html %}
